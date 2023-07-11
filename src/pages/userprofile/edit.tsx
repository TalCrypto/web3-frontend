import React from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import PageHeader from '@/components/layout/header/PageHeader';
import OutlineButton from '@/components/common/OutlineButton';
import PrimaryButton from '@/components/common/PrimaryButton';

const AddressPage: NextPage = () => {
  const router = useRouter();
  // const { address } = router.query;

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
                />
                <p className="text-[16px] leading-[19.5px] text-highEmphasis">0/20</p>
              </div>

              <ul className="mb-[36px] ml-6 list-disc text-b2 leading-[21.83px] text-highEmphasis">
                <li>
                  Your nickname will be displayed to other users in leaderboard, social sharing page etc. and can be edited 3 more times
                  this year.
                </li>
                <li>User ID needs to be unique.</li>
                <li>When creating your nickname, please ensure it does not contain disrespectful and racist words.</li>
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
                />
                <p className="text-end text-[16px] leading-[19.5px] text-highEmphasis">0/200</p>
              </div>

              <div className="flex justify-end space-x-[24px]">
                <OutlineButton
                  onClick={() => router.push('/userprofile/edit')}
                  className="w-[100px] rounded-[6px] !px-[24px] !py-[14px] !text-b2e text-white">
                  Cancel
                </OutlineButton>
                <PrimaryButton className="w-[100px] rounded-[6px] !px-[24px] !py-[14px] !text-b2e text-white">Save</PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddressPage;
