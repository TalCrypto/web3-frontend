/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
/* eslint-disable implicit-arrow-linebreak */
import { ethers, utils } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@tribe3/ethers-multicall';
import { signInWithCustomToken, signOut, getAuth } from 'firebase/auth';

import { showToast } from '@/components/common/Toast';
import {
  getOpenPositionEstimation,
  getMarginAdjustmentEstimation,
  getDashboardCardDetails,
  getMarketOverview,
  getTraderPositionInfo
} from './trading';

import collectionList from '../const/collectionList';
import * as whitelistJson from '../const/whitelist_lower_case.json';
import { apiConnection } from './apiConnection';
import { firebaseAuth } from '../const/firebaseConfig';
import tradePanelModal from '../stores/tradePanelModal';
import collectionsLoading from '../stores/collectionsLoading';
import { fluctuationLimit, initialMarginRatio, priceGapLimit } from '../stores/priceGap';
import { setPositionChanged } from '../stores/transaction';

const tokenABI = require('@/const/abi/token.json');
const clearingHseABI = require('@/const/abi/clearingHouse.json');
const faucetABI = require('@/const/abi/faucet.json');
const ammABI = require('@/const/abi/amm.json');
const clearingHouseViewerABI = require('@/const/abi/clearingHouseViewer.json');

const clearingHouseViewerAddr = process.env.NEXT_PUBLIC_CLEARING_HOUSE_VIEWER_ADDRESS;
const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY;
const suportChainId = parseInt(process.env.NEXT_PUBLIC_SUPPORT_CHAIN ?? '');
const provider = new ethers.providers.AlchemyProvider(process.env.NEXT_PUBLIC_ALCHEMY_PROVIDER, infuraKey);
const multicallProvider = new MulticallProvider(provider, suportChainId);

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: '1KfTCX6CmgMoQfeJLMAI0TpoLSQSudRJ', // required
      rpc: {
        1: 'https://1rpc.io/eth',
        42161: 'https://arb1.arbitrum.io/rpc',
        421613: 'https://goerli-rollup.arbitrum.io/rpc'
      },
      qrcode: true
    }
  }
};
const ammAddress = process.env.NEXT_PUBLIC_AMM_ADDRESS;
const faucetAddress = process.env.NEXT_PUBLIC_FACUET_ADDRESS;
const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

const tradeErrorMsgHandling = (error: any, type: any, toastData = { title: '', linkUrl: '' }) => {
  if (error?.message === 'time out') {
    return {
      error: {
        message: [
          'Your transaction has been sent, but there is congestion in the block chain.',
          'Please check in your Metamask console window later.'
        ],
        code: 400,
        type,
        showToast: () =>
          showToast(
            {
              error: true,
              title: toastData.title,
              message:
                'Your transaction has been sent, but there is congestion in the block chain. Please check in your Metamask console window or check on Arbiscan',
              linkUrl: toastData.linkUrl,
              linkLabel: 'Check on Arbiscan'
            },
            {
              autoClose: false,
              hideProgressBar: true
            }
          )
      },
      code: 400
    };
  }

  const errorMsgList: any = {
    AMM_POFL: 'Please try with smaller notional value.',
    CH_TMRL: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
    CH_TMRS: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
    CH_TLRL: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
    CH_TLRS: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
    CH_NW: 'Sorry your wallet address is not in the whitelist.',
    CH_MRNC: 'Trade failed to be executed as resulting margin ratio does not meet requirement.',
    CH_BDP: 'Trade failed to be executed due to bad debt incurred.'
  };

  const errorMessage = error?.error?.message.includes('execution reverted:') ? error?.error?.message : error?.message;
  const message = error?.error?.data?.message.includes('execution reverted:') ? error?.error?.data?.message : errorMessage;

  const errorMsgCode = message?.split('execution reverted: ')?.[1];
  const errorMsg = errorMsgList?.[errorMsgCode];

  if (!errorMsg) {
    if (type === 'modal') {
      return {
        error: {
          message: ['Your transaction has failed due to network error.', 'Please try again.'],
          code: 400,
          type,
          showToast: () =>
            showToast(
              {
                error: true,
                title: toastData.title,
                message: 'Your transaction has failed due to network error. Please try again.',
                linkUrl: toastData.linkUrl,
                linkLabel: 'Check on Arbiscan'
              },
              {
                autoClose: false,
                hideProgressBar: true
              }
            )
        },
        code: 400
      };
    }

    // check for high slippage error
    if (message?.includes('value out-of-bounds')) {
      return {
        error: {
          message: 'Please reduce slippage',
          code: 400,
          type
        },
        code: 400
      };
    }

    return error;
  }

  if (type === 'modal') {
    return {
      error: {
        message: ['Your transaction has failed due to high price fluctuation.', 'Please try again with smaller notional value'],
        code: 400,
        type,
        showToast: () =>
          showToast(
            {
              error: true,
              title: toastData.title,
              message: 'Your transaction has failed due to high price fluctuation. Please try again with smaller notional value.',
              linkUrl: toastData.linkUrl,
              linkLabel: 'Check on Arbiscan'
            },
            {
              autoClose: false,
              hideProgressBar: true
            }
          )
      },
      code: 400
    };
  }

  return {
    error: {
      message: errorMsg,
      code: 400,
      type
    },
    code: 400
  };
};

interface successToastHandlingProps {
  amm: any;
  title: string;
  linkUrl: string;
}

const successToastHandling = ({ amm, title, linkUrl }: successToastHandlingProps) => {
  setTimeout(async () => {
    // add waiting time for pending transactions for more smooth experience
    await collectionsLoading.setCollectionsLoading(amm, false);
    setPositionChanged({}, true);
    showToast(
      {
        title,
        message: 'Order Completed!',
        linkUrl,
        linkLabel: 'Check on Arbiscan'
      },
      {
        autoClose: 5000,
        hideProgressBar: true
      }
    );
  }, 2000);
};

const waitForTxConfirmation = async (tx: any) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('time out'));
    }, 30000); // 30 seconds in milliseconds
    tx.wait()
      .then((receipt: any) => {
        clearTimeout(timeout);
        resolve(receipt);
      })
      .catch((error: any) => {
        clearTimeout(timeout);
        reject(error);
      });
  });

export const clearingHouseAddress = process.env.NEXT_PUBLIC_CLEARING_ADDRESS ?? '';

interface WalletProvider {
  provider: any;
  web3Modal: Web3Modal | null;
  holderAddress: string;
  isWhitelisted: boolean;
  isWethCollected: boolean;
  isInputCode: boolean;
  isNetworkSame: boolean;
  isDataFetch: boolean;
  wethBalance: any;
  allowedValue: number;
  currentToken: any;
  currentTokenAmmAddress: any;
  currentTokenContractAddress: any;
  firebaseIdToken: string;
  initWeb3Modal: any;
  disconnectWallet: any;
  connectWallet: any;
  initialConnectWallet: any;
  isTargetNetwork: any;
  setHolderAddress: any;
  getHolderAddress: any;
  setCurrentToken: any;
  getCurrentToken: any;
  calculateEstimationValue: any;
  connectContract: any;
  createTransaction: any;
  closePosition: any;
  adjustPositionMargin: any;
  getTestToken: any;
  checkIsGoerliEthCollected: any;
  checkIsWethCollected: any;
  checkIsInputCode: any;
  getWethBalance: any;
  checkAllowance: any;
  performApprove: any;
  getMarginEstimation: any;
  reduceMargin: any;
  checkCurrentContractIsOpen: any;
  fetchDashboardInfomation: any;
  checkIsWhitelisted: any;
  fetchMarketOverview: any;
  checkIsWhitelistedByJson: any;
  getMaxReduceCollateralValue: any;
  checkIsTargetNetworkWithChain: any;
  signAuthMessage: any;
  addArbitrumGoerli: any;
  getPendingTransactions: any;
  getUserCollectionsInfo: any;
  getLiquidationRatio: any;
  getFluctuationLimitRatio: any;
  getInitialMarginRatio: any;
}

export const walletProvider: WalletProvider = {
  provider: null,
  web3Modal: null,
  holderAddress: '',
  isWhitelisted: false,
  isWethCollected: false,
  isInputCode: false,
  isNetworkSame: false,
  isDataFetch: false,
  wethBalance: 0,
  allowedValue: 0,
  currentToken: collectionList[0].collection,
  currentTokenAmmAddress: collectionList[0].amm,
  currentTokenContractAddress: collectionList[0].contract,
  firebaseIdToken: '',
  initWeb3Modal() {
    if (!this.web3Modal) {
      this.web3Modal = new Web3Modal({
        // network: "mumbai", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
    }
  },
  disconnectWallet: async function disconnectWallet() {
    this.initWeb3Modal();
    if (!this.web3Modal) return Promise.reject();
    await this.web3Modal.clearCachedProvider();
    this.provider = null;
    this.isWhitelisted = false;
    this.isWethCollected = false;
    this.isInputCode = false;
    this.isNetworkSame = false;
    this.holderAddress = '';
    if (!firebaseAuth) return Promise.reject();
    signOut(firebaseAuth).then(_ => {
      this.firebaseIdToken = '';
    });
    return Promise.resolve();
  },
  connectWallet: async function connectWallet() {
    this.initWeb3Modal();
    let instance = null;
    if (!window.ethereum) {
      if (!this.web3Modal) return Promise.reject();
      instance = await this.web3Modal.connect();
      this.provider = new ethers.providers.Web3Provider(instance, 'any');
    } else {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }

    if (this.provider !== null) {
      const address = await this.getHolderAddress();
      const currentNetwork = await this.provider.getNetwork();
      if (currentNetwork.chainId.toString() !== process.env.NEXT_PUBLIC_SUPPORT_CHAIN) {
        this.wethBalance = 0.0;
      } else {
        await this.getWethBalance(address);
      }
      return Promise.resolve();
    }
    return Promise.reject();
  },
  initialConnectWallet: async function initialConnectWallet(isWalletConnect = false) {
    this.initWeb3Modal();
    let instance = null;
    if (isWalletConnect) {
      if (!this.web3Modal) return Promise.reject();
      instance = await this.web3Modal.connectTo('walletconnect');
      this.provider = new ethers.providers.Web3Provider(instance, 'any');
    } else {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    let nonce = 0;
    let firToken = '';
    if (this.provider !== null) {
      const address = await this.getHolderAddress();
      const currentNetwork = await this.provider.getNetwork();
      console.log({ address, currentNetwork });
      if (currentNetwork.chainId.toString() !== process.env.NEXT_PUBLIC_SUPPORT_CHAIN) {
        this.wethBalance = 0.0;
      } else {
        await this.getWethBalance(address);
      }
      const postUserContent = await apiConnection.postUserContent(address);
      nonce = postUserContent.data.nonce;
      const postAuthUser = await apiConnection.postAuthUser(nonce);
      firToken = postAuthUser.data.token;
      if (!firebaseAuth) return Promise.reject();
      signInWithCustomToken(firebaseAuth, firToken)
        .then(userCredential => {
          const { user } = userCredential;
          user.getIdToken(true).then(idToken => {
            this.firebaseIdToken = idToken;
          });
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.disconnectWallet();
          return Promise.reject();
        });
    }
    return Promise.resolve();
  },
  isTargetNetwork: async function isTargetNetwork() {
    if (!this.provider) return false;
    const holderNetwork = await this.provider.getNetwork();
    let result = false;
    if (process.env.NEXT_PUBLIC_SUPPORT_CHAIN === holderNetwork.chainId.toString()) {
      result = true;
    } else {
      result = false;
    }
    this.isNetworkSame = result;
    return result;
  },
  setHolderAddress: async function setHolderAddress(address: any) {
    this.holderAddress = address;
    return this.holderAddress;
  },
  getHolderAddress: async function getHolderAddress() {
    if (!this.provider) return null;
    if (this.provider.connection.url === 'metamask') {
      this.holderAddress = await this.provider.provider.selectedAddress;
    } else {
      this.holderAddress = await this.provider.provider.accounts[0];
    }
    return this.holderAddress;
  },
  setCurrentToken: function setCurrentToken(tokens: any) {
    const targetCollection = collectionList.filter(({ collection }) => collection === tokens);
    const { amm, contract } = targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
    this.currentToken = tokens;
    this.currentTokenAmmAddress = amm;
    this.currentTokenContractAddress = contract;
  },
  getCurrentToken: function getCurrentToken() {
    const targetCollection = collectionList.filter(({ collection }) => collection === this.currentToken);
    const { amm, contract } = targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
    this.currentTokenAmmAddress = amm;
    this.currentTokenContractAddress = contract;
  },
  calculateEstimationValue: function calculateEstimationValue(isDoBuyAction: boolean, enterValue: any, leverageValue: any) {
    this.getCurrentToken();
    const betEth = utils.parseEther(enterValue.toString());
    const leverageEth = utils.parseEther(leverageValue.toString());
    const longShortValue = isDoBuyAction ? 'short' : 'long';
    return getOpenPositionEstimation(this.currentTokenAmmAddress, this.holderAddress, betEth, leverageEth, longShortValue);
  },

  connectContract: async function connectContract() {
    if (!this.isTargetNetwork()) {
      return Promise.reject();
    }

    if (!this.provider) return false;

    const providerSigner = this.provider.getSigner(this.holderAddress);
    const address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';
    const erc20ContractInstance = new ethers.Contract(address, tokenABI, providerSigner);
    return Promise.resolve(erc20ContractInstance);
  },

  createTransaction: async function createTransaction(
    longOrShort: number,
    quantity: number,
    leverageValue: number,
    toleranceRate: number,
    exposureValue: any,
    transactionType: any,
    refreshState: any
  ) {
    let tx;
    try {
      if (!this.provider) return false;

      this.getCurrentToken();
      const notionalAmount = quantity;
      const refinedSlippage = toleranceRate / 100;
      const slippageHandler = longOrShort === 0 ? 1 - refinedSlippage : 1 + refinedSlippage;

      const calcAssetAmountTemp = Number(utils.formatEther(exposureValue.abs())) * Number(utils.parseEther(slippageHandler.toString()));
      const calcAssetAmount = calcAssetAmountTemp / Number(utils.parseEther('1'));
      const fixedCalcAssetAmount = calcAssetAmount.toFixed(18);
      const assetAmountLimit = utils.parseEther(fixedCalcAssetAmount.toString());
      const leverageValueBig = utils.parseEther(String(leverageValue));
      const amountValue = utils.parseEther(String(notionalAmount));
      const providerSigner = this.provider.getSigner(this.holderAddress);
      const clearingHseInstance = new ethers.Contract(clearingHouseAddress, clearingHseABI, providerSigner);
      tx = await clearingHseInstance.openPosition(
        this.currentTokenAmmAddress,
        longOrShort,
        amountValue,
        leverageValueBig,
        assetAmountLimit,
        true
      );
    } catch (error) {
      refreshState();
      const errorObj = tradeErrorMsgHandling(error, 'text');
      // console.log('error from clearingHseInstance.openPosition => ', error);
      return Promise.reject(errorObj);
    }

    const targetCollection = collectionList.filter(({ amm }) => amm === this.currentTokenAmmAddress);
    showToast(
      {
        warning: true,
        title: `${targetCollection[0]?.shortName} - ${transactionType}`,
        message: 'Order Received!',
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`,
        linkLabel: 'Check on Arbiscan'
      },
      {
        autoClose: 5000,
        hideProgressBar: true
      }
    );

    try {
      refreshState();
      collectionsLoading.setCollectionsLoading(this.currentTokenAmmAddress, tx.hash);
      await tx.wait();
      const auth = getAuth();

      const { currentUser } = auth;
      if (!currentUser) return Promise.reject();

      const tokenId = await currentUser.getIdToken();
      const finishTrade = await apiConnection.finishTrade(tx.hash, tokenId);
      if (!this.isInputCode) {
        await this.checkIsInputCode();
      }
      await this.getWethBalance(this.holderAddress);
      successToastHandling({
        amm: targetCollection[0]?.amm,
        title: `${targetCollection[0]?.shortName} - ${transactionType}`,
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`
      });
      return Promise.resolve();
    } catch (error: any) {
      collectionsLoading.setCollectionsLoading(this.currentTokenAmmAddress, false);
      const errorObj = tradeErrorMsgHandling(error, 'modal', {
        title: `${targetCollection[0]?.shortName} - ${transactionType}`,
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`
      });
      // console.log('error from tx.wait => ', error);
      if (error?.message === 'time out') tradePanelModal.setLink(`${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`);
      return Promise.reject(errorObj);
    }
  },
  closePosition: async function closePosition(refreshState: any) {
    if (!this.provider) return Promise.reject();
    this.getCurrentToken();
    const providerSigner = this.provider.getSigner(this.holderAddress);
    const clearingHseInstance = new ethers.Contract(clearingHouseAddress, clearingHseABI, providerSigner);
    const testClearAmount = utils.parseEther(String(0));

    let tx;
    try {
      tx = await clearingHseInstance.closePosition(this.currentTokenAmmAddress, testClearAmount);
    } catch (error) {
      refreshState();
      const errorObj = tradeErrorMsgHandling(error, 'text');
      // console.log('error from clearingHseInstance.closePosition => ', error);
      return Promise.reject(errorObj);
    }

    const targetCollection = collectionList.filter(({ amm }) => amm === this.currentTokenAmmAddress);
    showToast(
      {
        warning: true,
        title: `${targetCollection[0]?.shortName} - Full Close Position`,
        message: 'Order Received!',
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`,
        linkLabel: 'Check on Arbiscan'
      },
      {
        autoClose: 5000,
        hideProgressBar: true
      }
    );

    try {
      refreshState();
      collectionsLoading.setCollectionsLoading(this.currentTokenAmmAddress, tx.hash);
      await tx.wait();
      const auth = getAuth();

      const { currentUser } = auth;
      if (!currentUser) return Promise.reject();

      const tokenId = await currentUser.getIdToken();
      await apiConnection.finishTrade(tx.hash, tokenId);
      await this.getWethBalance(this.holderAddress);
      successToastHandling({
        amm: targetCollection[0]?.amm,
        title: `${targetCollection[0]?.shortName} - Full Close Position`,
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`
      });
      return Promise.resolve();
    } catch (error: any) {
      collectionsLoading.setCollectionsLoading(this.currentTokenAmmAddress, false);
      const errorObj = tradeErrorMsgHandling(error, 'modal', {
        title: `${targetCollection[0]?.title} - Full Close Position`,
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`
      });
      // console.log('error from tx.wait => ', error);
      if (error?.message === 'time out') tradePanelModal.setLink(`${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`);
      return Promise.reject(errorObj);
    }
  },
  adjustPositionMargin: async function adjustPositionMargin(adjustMarginValue: any, refreshState: any) {
    this.getCurrentToken();

    if (!this.provider) return Promise.reject();

    const providerSigner = this.provider.getSigner(this.holderAddress);
    const clearingHseInstance = new ethers.Contract(clearingHouseAddress, clearingHseABI, providerSigner);

    let tx;
    try {
      tx = await clearingHseInstance.addMargin(this.currentTokenAmmAddress, utils.parseEther(String(adjustMarginValue)));
    } catch (error) {
      refreshState();
      const errorObj = tradeErrorMsgHandling(error, 'text');
      // console.log('error from clearingHseInstance.addMargin => ', error);
      return Promise.reject(errorObj);
    }

    const targetCollection = collectionList.filter(({ amm }) => amm === this.currentTokenAmmAddress);
    showToast(
      {
        warning: true,
        title: `${targetCollection[0]?.shortName} - Add Collateral`,
        message: 'Order Received!',
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`,
        linkLabel: 'Check on Arbiscan'
      },
      {
        autoClose: 5000,
        hideProgressBar: true
      }
    );

    try {
      refreshState();
      collectionsLoading.setCollectionsLoading(this.currentTokenAmmAddress, tx.hash);
      await tx.wait();
      await this.getWethBalance(this.holderAddress);
      successToastHandling({
        amm: targetCollection[0]?.amm,
        title: `${targetCollection[0]?.shortName} - Add Collateral`,
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`
      });
      return Promise.resolve();
    } catch (error: any) {
      collectionsLoading.setCollectionsLoading(this.currentTokenAmmAddress, false);
      const errorObj = tradeErrorMsgHandling(error, 'modal', {
        title: `${targetCollection[0]?.title} - Add Collateral`,
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`
      });
      // console.log('error from tx.wait => ', error);
      if (error?.message === 'time out') tradePanelModal.setLink(`${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`);
      return Promise.reject(errorObj);
    }
  },
  getTestToken: async function getTestToken() {
    // const providerSigner = this.provider.getSigner(this.holderAddress);
    // const faucetInstance = new ethers.Contract(faucetAddress, faucetABI, providerSigner);
    // try {
    //   const tx = await faucetInstance.requestTokens();
    //   await tx.wait();
    //   await this.getWethBalance(this.holderAddress);
    //   return Promise.resolve();
    // } catch (error) {
    //   this.isDataFetch = false;
    //   return Promise.reject(error);
    // }
    return Promise.resolve();
  },
  checkIsGoerliEthCollected: async function checkIsGoerliEthCollected() {
    try {
      const balance = await provider.getBalance(this.holderAddress);
      const balanceInEth = ethers.utils.formatEther(balance);
      const isGoerliEthCollected = Number(balanceInEth) > 0;
      return isGoerliEthCollected;
    } catch (error) {
      return false;
    }
  },
  checkIsWethCollected: async function checkIsWethCollected() {
    // const providerSigner = this.provider.getSigner(this.holderAddress);
    // const faucetInstance = new ethers.Contract(faucetAddress, faucetABI, providerSigner);
    // try {
    //   const tx = await faucetInstance.claimCount(this.holderAddress);
    //   this.isWethCollected = tx > 0;
    //   return this.isWethCollected;
    // } catch (error) {
    //   return false;
    // }
    return true;
  },
  checkIsInputCode: async function checkIsInputCode() {
    try {
      const res = await apiConnection.getUserInfo(this.holderAddress);
      this.isInputCode = res.data.isInputCode;
      return this.isInputCode;
    } catch (error) {
      return false;
    }
  },
  getWethBalance: async function getWethBalance(holderAddress: any) {
    if (!this.provider) return 0;

    const providerSigner = this.provider.getSigner(holderAddress);
    const address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';
    const erc20ContractInstance = new ethers.Contract(address, tokenABI, providerSigner);
    try {
      const balance = await erc20ContractInstance.balanceOf(this.holderAddress);
      const balanceInNum = (Math.floor(Number(Number(utils.formatEther(balance)) * 10000)) / 10000).toString();
      // const balanceInNum = Number(utils.formatEther(balance)).toFixed(4).toString();
      this.wethBalance = balanceInNum;
    } catch (error) {
      this.wethBalance = 0.0;
    }
    return this.wethBalance;
  },
  checkAllowance: async function checkAllowance() {
    if (!this.provider) return 0;
    const providerSigner = this.provider.getSigner(this.holderAddress);
    const address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';
    const erc20ContractInstance = new ethers.Contract(address, tokenABI, providerSigner);
    const allowedValue = utils.formatEther(await erc20ContractInstance.allowance(walletProvider.holderAddress, clearingHouseAddress));
    this.allowedValue = Number(allowedValue);
    return this.allowedValue;
  },
  performApprove: async function performApprove() {
    if (!this.provider) return Promise.reject();

    const providerSigner = this.provider.getSigner(this.holderAddress);
    const address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';
    const erc20ContractInstance = new ethers.Contract(address, tokenABI, providerSigner);
    try {
      const tx = await erc20ContractInstance.approve(clearingHouseAddress, ethers.constants.MaxUint256);
      await tx.wait();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getMarginEstimation: async function getMarginEstimation(adjustMarginValue: any, side: any) {
    this.getCurrentToken();
    try {
      const formatValue = utils.parseEther(adjustMarginValue);
      return getMarginAdjustmentEstimation(this.currentTokenAmmAddress, this.holderAddress, formatValue, side);
    } catch (error) {
      return null;
    }
  },
  reduceMargin: async function reduceMargin(adjustMarginValue: any, refreshState: any) {
    if (!this.provider) return Promise.reject();
    const providerSigner = this.provider.getSigner(this.holderAddress);
    const clearingHseInstance = new ethers.Contract(clearingHouseAddress, clearingHseABI, providerSigner);

    let tx;
    try {
      tx = await clearingHseInstance.removeMargin(this.currentTokenAmmAddress, utils.parseEther(String(adjustMarginValue)));
    } catch (error) {
      refreshState();
      const errorObj = tradeErrorMsgHandling(error, 'text');
      // console.log('error from clearingHseInstance.removeMargin => ', error);
      return Promise.reject(errorObj);
    }

    const targetCollection = collectionList.filter(({ amm }) => amm === this.currentTokenAmmAddress);
    showToast(
      {
        warning: true,
        title: `${targetCollection[0]?.shortName} - Reduce Collateral`,
        message: 'Order Received!',
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`,
        linkLabel: 'Check on Arbiscan'
      },
      {
        autoClose: 5000,
        hideProgressBar: true
      }
    );

    try {
      refreshState();
      collectionsLoading.setCollectionsLoading(this.currentTokenAmmAddress, tx.hash);
      await tx.wait();
      await this.getWethBalance(this.holderAddress);

      successToastHandling({
        amm: targetCollection[0]?.amm,
        title: `${targetCollection[0]?.shortName} - Reduce Collateral`,
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`
      });
      return Promise.resolve();
    } catch (error: any) {
      collectionsLoading.setCollectionsLoading(this.currentTokenAmmAddress, false);
      const errorObj = tradeErrorMsgHandling(error, 'modal', {
        title: `${targetCollection[0]?.title} - Reduce Collateral`,
        linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`
      });
      // console.log('error from tx.wait => ', error);
      if (error?.message === 'time out') tradePanelModal.setLink(`${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${tx.hash}`);
      return Promise.reject(errorObj);
    }
  },
  checkCurrentContractIsOpen: async function checkCurrentContractIsOpen(ammAddr: any) {
    if (!this.provider) return Promise.reject();
    const providerSigner = this.provider.getSigner(this.holderAddress);
    const contractInstance = new ethers.Contract(ammAddr, ammABI, providerSigner);
    const instanceOpen = await contractInstance.open();

    return Promise.resolve(instanceOpen);
  },
  fetchDashboardInfomation: async function fetchDashboardInfomation() {
    const list = collectionList.map(({ amm }) => amm).filter(item => item !== '');
    return getDashboardCardDetails(list, this.holderAddress);
  },
  checkIsWhitelisted: async function checkIsWhitelisted() {
    // const providerSigner = this.provider.getSigner(this.holderAddress);
    // const faucetInstance = new ethers.Contract(faucetAddress, faucetABI, providerSigner);
    // const isWhitelisted = await faucetInstance.whitelist(this.holderAddress);

    // if (!isWhitelisted) {
    //   this.isWhitelisted = false;
    //   return Promise.reject();
    // }
    // this.isWhitelisted = true;
    // return Promise.resolve(true);
    return true;
  },
  fetchMarketOverview: async function fetchMarketOverview() {
    const ammList = collectionList.map(({ amm }) => amm).filter(item => item !== '');
    const contractList = collectionList.map(({ contract }) => contract).filter(item => item !== '');
    return getMarketOverview(ammList, contractList, this.holderAddress);
  },
  checkIsWhitelistedByJson: function checkIsWhitelistedByJson() {
    // const addr = '0x3b3bca3eee8d081505e6459f61b507b519eeee70';
    const addr = this.holderAddress;
    const addressExist = addr in whitelistJson;
    if (!addressExist) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getMaxReduceCollateralValue: async function getMaxReduceCollateralValue(ammAddr: any, holderAddress: any) {
    const clearingHouseViewerContract = new MulticallContract(clearingHouseViewerAddr, clearingHouseViewerABI);
    try {
      const [result] = await multicallProvider.all([clearingHouseViewerContract.getFreeCollateral(ammAddr, holderAddress)]);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject();
    }
  },
  checkIsTargetNetworkWithChain: async function checkIsTargetNetworkWithChain() {
    if (!this.provider) return Promise.reject();
    const holderNetwork = await this.provider.getNetwork();
    let result = false;
    const holderChain = holderNetwork.chainId;

    if (process.env.NEXT_PUBLIC_SUPPORT_CHAIN === holderNetwork.chainId.toString()) {
      result = true;
      return { result, holderChain };
    }
    result = false;
    return { result, holderChain };
  },
  signAuthMessage: async function signAuthMessage(nonce: any) {
    if (!this.provider) return Promise.reject();
    const providerSigner = this.provider.getSigner(this.holderAddress);
    const messageHex = `\x19Ethereum Signed Message:\nI am signing my one-time nonce: ${nonce}`;
    try {
      const signedMessage = await providerSigner.signMessage(messageHex);
      return Promise.resolve(signedMessage);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  addArbitrumGoerli: async function addArbitrumGoerli() {
    const networkId = utils.hexValue(Number(process.env.NEXT_PUBLIC_SUPPORT_CHAIN || 42161));
    try {
      if (!walletProvider.provider) return Promise.reject();
      await walletProvider.provider.provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: networkId,
            rpcUrls: ['https://arb1.arbitrum.io/rpc'],
            chainName: 'Arbitrum Mainnet',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            blockExplorerUrls: ['https://arbiscan.io/']
          }
        ]
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPendingTransactions: async function getPendingTransactions(collectionsLoadingList: any, selectedCollection: any) {
    const newCollLoadingList = {
      ...collectionsLoadingList
    };

    if (selectedCollection?.txHash) {
      try {
        const transaction = await provider.getTransaction(selectedCollection.txHash);
        if (transaction.confirmations > 0) {
          newCollLoadingList[selectedCollection.amm] = false;
        }
      } catch (error) {
        newCollLoadingList[selectedCollection.amm] = false;
      }
    } else {
      for await (const [key, value] of Object.entries(collectionsLoadingList)) {
        if (value) {
          const transaction = await provider.getTransaction(value.toString());
          if (transaction?.confirmations > 0) {
            newCollLoadingList[key] = false;
            continue;
          }
        }
        newCollLoadingList[key] = false;
      }
    }

    return newCollLoadingList;
  },

  getUserCollectionsInfo: async function getUserCollectionsInfo(walletAddress: any) {
    let userCollectionsInfo: any = [];
    try {
      const userCollectionsInfoPromise = await Promise.allSettled([
        ...collectionList.map(collection => getTraderPositionInfo(collection.amm, walletAddress))
      ]);
      userCollectionsInfo = userCollectionsInfoPromise.map((userCollInfo: any) => userCollInfo?.value);
    } catch (error) {
      // console.log('getUserCollectionsInfo => ', error);
    }

    return userCollectionsInfo;
  },

  getLiquidationRatio: async function getLiquidationRatio() {
    try {
      if (!this.provider) return Promise.reject();
      const providerSigner = this.provider.getSigner(this.holderAddress);
      const clearingHseInstance = new ethers.Contract(clearingHouseAddress, clearingHseABI, providerSigner);
      const rate = await clearingHseInstance.LIQ_SWITCH_RATIO();
      priceGapLimit.set(utils.formatEther(rate));
      return Promise.resolve(utils.formatEther(rate));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getFluctuationLimitRatio: async function getFluctuationLimitRatio(params: any, ammAddr: any = process.env.NEXT_PUBLIC_AMM_ADDRESS) {
    try {
      const providerSigner = this.provider.getSigner(this.holderAddress);
      const contractInstance = new ethers.Contract(ammAddr, ammABI, providerSigner);
      const rate: any = await contractInstance.fluctuationLimitRatio();
      fluctuationLimit.set(Number(Number(utils.formatEther(rate)) * 100));
      return Promise.resolve(utils.formatEther(rate));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getInitialMarginRatio: async function getInitialMarginRatio(params: any, ammAddr: any = process.env.NEXT_PUBLIC_AMM_ADDRESS) {
    try {
      const providerSigner = this.provider.getSigner(this.holderAddress);
      const contractInstance = new ethers.Contract(ammAddr, ammABI, providerSigner);
      const rate: any = await contractInstance.initMarginRatio();
      initialMarginRatio.set(Number(Number(utils.formatEther(rate)) * 100));
      return Promise.resolve(utils.formatEther(rate));
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
