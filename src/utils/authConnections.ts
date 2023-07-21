/* eslint-disable max-len */
import { useSignMessage } from 'wagmi';
import { $userAddress } from '@/stores/user';
import { useStore as useNanostore } from '@nanostores/react';
import { firebaseAuth } from '@/const/firebaseConfig';
import { signInWithCustomToken } from 'firebase/auth';
import { getAccount, getWalletClient } from 'wagmi/actions';

const authUrl = process.env.NEXT_PUBLIC_AUTHENTICATION_API_URL;

export const authConnections = {
  postUserContent: async function postUserContent(address: string) {
    const postUserUrl = `${authUrl}/users`;
    const postData = { userAddress: address };
    try {
      const callPost = await fetch(postUserUrl, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const returnData = await callPost.json();
      return Promise.resolve(returnData);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  postAuthUser: async function postAuthUser(nonce: string, userAddress: string) {
    const messageHex = `\x19Ethereum Signed Message:\nHi there! Welcome to Tribe3!\n\nClick to log in to access your very own profile on Tribe3. Please note that this will not execute any blockchain transaction nor it will cost you any gas fee.\n\nYour Nonce: ${nonce}`;
    const walletClient = await getWalletClient();
    // const userAddress = useNanostore($userAddress);

    const postAuthUserUrl = `${authUrl}/users/auth`;
    const signature = await walletClient?.signMessage({
      message: messageHex
    });
    const postData = { publicAddress: userAddress.toLowerCase(), signature };
    try {
      const callPost = await fetch(postAuthUserUrl, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const returnData = await callPost.json();
      return Promise.resolve(returnData);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  switchCurrentUser: async function switchCurrentUser(userAddress: string) {
    const auth = firebaseAuth;
    const currentUser = auth?.currentUser;
    const postUserContent = await this.postUserContent(userAddress);
    const { nonce } = postUserContent.data;
    const postAuthUser = await this.postAuthUser(nonce, userAddress);
    console.log({ postAuthUser });
    const firToken = postAuthUser.data.token;
    try {
      const userCredential = await signInWithCustomToken(firebaseAuth!, firToken);
      const { user } = userCredential;
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
