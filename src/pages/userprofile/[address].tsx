import React from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import PageHeader from '@/components/layout/header/PageHeader';
import Image from 'next/image';
import OutlineButton from '@/components/common/OutlineButton';
import ProfileBadge from '@/components/userprofile/ProfileBadge';
import TabItems from '@/components/userprofile/TabItems';

const AddressPage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  console.log(address);

  return (
    <>
      <PageHeader
        title="Profile"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />

      <main>
        <div className="content-container">
          <div className="flex md:space-x-[48px]">
            <div className="flex-1">
              <div className="mb-[36px] flex justify-between">
                {/* search input */}
                <div className="flex min-w-[280px] space-x-2 rounded-full border border-[#FFFFFF26] bg-white/10 px-4 py-2">
                  <Image src="/images/components/userprofile/search.svg" alt="" width={20} height={20} />
                  <input
                    type="text"
                    className="flex-1 bg-transparent py-[2px] text-b3 outline-none"
                    placeholder="Search user ID / wallet address"
                  />
                </div>

                <div className="flex space-x-4">
                  <OutlineButton>
                    <span className="font-normal">Edit</span>
                  </OutlineButton>
                  <OutlineButton>
                    <Image src="/images/components/userprofile/share.svg" alt="" width={20} height={20} />
                  </OutlineButton>
                </div>
              </div>

              {/* username / wallet address */}
              <div className="mb-4 flex justify-between">
                <div className="flex space-x-4">
                  <div className="">
                    <p className="text-h2 text-[#FFC977]">JEFFGPT9999999</p>
                  </div>
                  <div className="flex items-center space-x-[6px]">
                    <p className="text-mediumEmphasis">0xbf44b...980</p>
                    <Image src="/images/components/userprofile/copy.svg" alt="" width={20} height={20} />
                  </div>
                </div>

                <div className="flex space-x-[16px]">
                  <div>
                    <p className="text-b1 text-mediumEmphasis">
                      Followers <span className="text-b1e text-highEmphasis">10</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-b1 text-mediumEmphasis">
                      Followers <span className="text-b1e text-highEmphasis">10</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-[36px] flex space-x-[36px]">
                {/* badge labels */}
                <div className="flex space-x-[6px]">
                  <ProfileBadge color="sky">WHALE</ProfileBadge>
                  <ProfileBadge color="red">OG</ProfileBadge>
                  <ProfileBadge color="yellow">TOP GAINER</ProfileBadge>
                  <ProfileBadge color="green">PUNK LOVER</ProfileBadge>
                </div>

                <div className="flex items-center">
                  <p className="text-b1 text-mediumEmphasis">NFT Holding</p>
                </div>
              </div>

              <div className="mb-[36px] flex space-x-[36px]">
                <p className="text-b1e text-highEmphasis">About</p>
                <p className="text-b1 text-highEmphasis">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
            {/* cards airdrop / trading competition */}
            <div className="flex space-x-[24px]">
              <div className="flex rounded-[12px] border border-[#FFD392] p-[24px]">
                <p>Airdrop Season 2</p>
              </div>
              <div className="flex rounded-[12px] border border-[#FFD392] p-[24px]">
                <p>Trading Competition</p>
              </div>
            </div>
          </div>

          <TabItems />
        </div>

        <div className="border-t border-t-[#71AAFF38] bg-[#00000080]">
          <div className="content-container py-[48px]">
            <p>test</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddressPage;
