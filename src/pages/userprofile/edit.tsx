import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import PageHeader from '@/components/layout/header/PageHeader';
import OutlineButton from '@/components/common/OutlineButton';
import PrimaryButton from '@/components/common/PrimaryButton';
import { $userAddress, $userIsConnected, setUserInfo } from '@/stores/user';
import { useStore } from '@nanostores/react';
import { getAuth } from 'firebase/auth';
import { authConnections } from '@/utils/authConnections';
import { apiConnection } from '@/utils/apiConnection';
import { showOutlineToast } from '@/components/common/Toast';

const AddressPage: NextPage = () => {
  const router = useRouter();
  const isConnected = useStore($userIsConnected);
  const currentUserAddress = useStore($userAddress);
  const [userId, setUserId] = useState('');
  const [about, setAbout] = useState('');
  const [isErrorUnique, setIsErrorUnique] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userCharLongMin = 3;
  const userCharLongMax = 20;
  const isUserCharLongValid = userId.length >= userCharLongMin && userId.length <= userCharLongMax;
  const regex = /[^A-Za-z0-9_-]/;
  const isUserCharValid = !regex.test(userId);
  const isUserIdValid = isUserCharLongValid && isUserCharValid && !isLoading;

  const aboutCharLongMax = 200;
  const isAboutCharLongValid = about.length <= aboutCharLongMax;
  const isSaveAllowed = isUserIdValid && isAboutCharLongValid && isConnected;

  // useEffect(() => {
  //   showOutlineToast({ title: 'Changes have not been saved' });
  //   showOutlineToast({ title: 'Changes have not been saved', error: true });
  //   showOutlineToast({ title: 'Changes have not been saved', warning: true });
  // }, []);

  const submit = async () => {
    try {
      setIsLoading(true);
      let auth = getAuth();
      let currentUser = auth?.currentUser;
      const userAddr: any = currentUserAddress?.toLowerCase();
      if (!currentUser || currentUser.uid !== userAddr) {
        await authConnections.switchCurrentUser(userAddr || '');
        auth = getAuth();
        currentUser = auth?.currentUser;
      }
      const newToken: any = await currentUser?.getIdToken(true);
      try {
        const res = await apiConnection.updateUserInfo(userId, about, newToken, userAddr);
        const userInfoRes = await apiConnection.getUserInfo(userAddr);
        if (res.code === 0) {
          setUserInfo(userInfoRes.data, userAddr);
          showOutlineToast({ title: 'Changes have been saved.' });
          setTimeout(() => {
            router.push(`/userprofile/${currentUserAddress}`);
          }, 500);
        } else {
          showOutlineToast({ title: 'Changes have not been saved.', error: true });
          setIsErrorUnique(true);
          setIsLoading(false);
        }
      } catch (error) {
        showOutlineToast({ title: 'Changes have not been saved.', warning: true });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getUserInfo() {
      setIsLoading(true);
      const userInfoRes = await apiConnection.getUserInfo(currentUserAddress);

      if (userInfoRes.code === 0) {
        const { username, about: userAbout } = userInfoRes.data;
        setUserId(username);
        setAbout(userAbout);
      }
      setIsLoading(false);
    }

    if (currentUserAddress) {
      getUserInfo();
    }
  }, [currentUserAddress]);

  return (
    <>
      <PageHeader
        title="Profile"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />

      <main>
        <div className="content-container min-h-[85vh]">
          <div
            className={`rounded-[6px] 
            border border-[rgba(113,170,255,0.25)] bg-gradient-to-b from-[#37387280] to-[#0C0D1F80] 
            p-[36px] text-b2 text-mediumEmphasis`}>
            <div className="max-w-[668px]">
              <div className="mb-[36px] flex space-x-2">
                <div className="w-[3px] rounded bg-[#2574FB]" />
                <p className="text-h4 text-highEmphasis">Edit Profile</p>
              </div>

              <p className="mb-2 text-h5 text-highEmphasis">User ID</p>

              {/* input text */}
              <div
                className={`mb-[20px] flex min-w-[280px] items-center space-x-2 
              rounded-[4px] border border-[#FFFFFF26] bg-white/10 p-[14px]`}>
                <input
                  type="text"
                  className={`flex-1 bg-transparent py-[2px] text-[16px]
                  leading-[19.5px] text-highEmphasis outline-none placeholder:text-mediumEmphasis`}
                  placeholder="Enter your name here"
                  onChange={e => setUserId(e.target.value)}
                  value={userId}
                />
                <p className="text-[16px] leading-[19.5px] text-highEmphasis">
                  <span className={`${isUserCharLongValid ? '' : 'text-red-500'}`}>{userId.length}</span>/{userCharLongMax}
                </p>
              </div>

              <ul className="mb-[36px] ml-6 list-disc text-b2 leading-[21.83px] text-highEmphasis">
                <li>Your nickname will be displayed to other users in leaderboard, social sharing page etc.</li>
                <li className={`${isUserCharLongValid ? '' : 'text-red-500'}`}>User ID has to be 3-20 characters long.</li>
                <li className={`${isUserCharValid ? '' : 'text-red-500'}`}>
                  Valid Characters include A-z, 0-9, &quot;_&quot; and &quot;-&quot;
                </li>
                <li className={`${!isErrorUnique ? '' : 'text-red-500'}`}>User ID needs to be unique.</li>
                <li>After you submit, it usually takes a few minutes to review and approve.</li>
              </ul>

              <p className="mb-2 text-h5 text-highEmphasis">About (optional)</p>

              {/* textarea */}
              <div
                className={`mb-[36px] flex min-w-[280px] flex-col space-y-2 
              rounded-[4px] border border-[#FFFFFF26] bg-white/10 p-[14px]`}>
                <textarea
                  rows={7}
                  className={`flex-1 bg-transparent py-[2px] text-[16px]
                  leading-[19.5px] text-highEmphasis outline-none placeholder:text-mediumEmphasis`}
                  placeholder="Tell your story to the world !"
                  onChange={e => setAbout(e.target.value)}
                  value={about}
                />
                <p className="text-end text-[16px] leading-[19.5px] text-highEmphasis">
                  <span className={`${isAboutCharLongValid ? '' : 'text-red-500'}`}>{about.length}</span>/{aboutCharLongMax}
                </p>
              </div>

              <div className="flex justify-end space-x-[24px]">
                <OutlineButton
                  onClick={() => router.push(`/userprofile/${currentUserAddress}`)}
                  className="w-[100px] rounded-[6px] !px-[24px] !py-[14px] !text-b2e text-white">
                  Cancel
                </OutlineButton>
                <PrimaryButton
                  onClick={() => submit()}
                  isDisabled={!isSaveAllowed}
                  className="w-[100px] rounded-[6px] !px-[24px] !py-[14px] !text-b2e text-white">
                  Save
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddressPage;
