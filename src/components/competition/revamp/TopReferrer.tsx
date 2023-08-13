/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useStore } from '@nanostores/react';
import { $isShowMobileMyReferrerTeam, $isShowMobileMyTeam, $isShowMobileRules } from '@/stores/competition';
import Tooltip from '@/components/common/Tooltip';
import { $userInfo, $userIsConnected } from '@/stores/user';
import {
  $myRefererTeamList,
  $myRefererUserItem,
  $referralTeamList,
  $referralUserItem,
  $topReferrerRankingList,
  $topReferrerUserItem,
  TopReferrerRanking
} from '@/stores/revampCompetition';
import { useAccount } from 'wagmi';
import { trimAddress, trimString } from '@/utils/string';
import { formatBigInt } from '@/utils/bigInt';
import { $userPoint, defaultUserPoint } from '@/stores/airdrop';
import ShareModal from '@/components/airdrop/desktop/ShareModal';
import ReferreeModal from '@/components/competition/revamp/TopReferrer/RefereeModal';
import MyReferrersTeamMobile from '@/components/competition/revamp/TopReferrer/Mobile/MyReferrersTeamMobile';
import ShareMobileModal from '@/components/airdrop/mobile/ShareMobileModal';
import ContributionDetailsMobile from '@/components/competition/revamp/TopReferrer/Mobile/ContributionDetail';
import { $isMobileScreen } from '@/stores/window';
import MobileTooltip from '@/components/common/mobile/Tooltip';
import { useRouter } from 'next/router';
import TopThree from './TopThree';
import FloatingWidget from './FloatingWidget';
import Table, { TableColumn } from './Table';
import UserMedal from './UserMedal';
import PrizePool from './TopReferrer/PrizePool';
import Rules from './TopReferrer/Rules';
import MobileDrawer from './MobileDrawer';
import MyTeam from './TopReferrer/MyTeam';
import MyReferrersTeam from './TopReferrer/MyReferrersTeam';
import CountdownTimer from './CountdownTimer';

const TopReferrer = () => {
  const router = useRouter();
  const { address } = useAccount();
  const isConnected = useStore($userIsConnected);
  const userInfo = useStore($userInfo);
  const isShowMobileMyTeam = useStore($isShowMobileMyTeam);
  const isShowMobileMyReferrerTeam = useStore($isShowMobileMyReferrerTeam);
  const isShowMobileRules = useStore($isShowMobileRules);
  const isMobileScreen = useStore($isMobileScreen);

  const rankingList = useStore($topReferrerRankingList);
  const userItemRank = useStore($topReferrerUserItem);
  const userRank: TopReferrerRanking = userItemRank?.userAddress
    ? userItemRank
    : {
        rank: '0',
        userAddress: userInfo?.userAddress,
        username: userInfo?.username,
        refereeCount: 0,
        totalVolume: '0',
        pointPrize: 0,
        usdtPrize: 0
      };

  const referralTeamList = useStore($referralTeamList);
  const referralUserItem = useStore($referralUserItem);
  const myRefererUserItem = useStore($myRefererUserItem);
  const myRefererTeamList = useStore($myRefererTeamList);

  const userPointData = useStore($userPoint);
  const userPoint = userPointData || defaultUserPoint;
  const { referralCode } = userPoint;

  const displayUsername =
    userInfo?.username === '' ? `${userInfo.userAddress.substring(0, 7)}...${userInfo.userAddress.slice(-3)}` : userInfo?.username;

  const [isShowShareModal, setIsShowShareModal] = useState(false);
  const [isShowMobileShareModal, setIsShowMobileShareModal] = useState(false);
  const [isShowReferralModal, setIsShowReferralModal] = useState(false);

  useEffect(() => {
    console.log({ rankingList, userItemRank });
  }, [rankingList, userItemRank]);

  // define tables columns
  const tableColumns: TableColumn<TopReferrerRanking>[] = [
    {
      label: 'Rank',
      className: 'pl-5 lg:p-0 basis-2/6 lg:basis-1/6 text-left lg:text-center',
      render: row => (
        <div className="flex basis-1/4 lg:justify-center">
          <UserMedal
            rank={Number(row.rank)}
            isUnranked={Number(row.rank) === 0}
            isYou={row.userAddress?.toLowerCase() === address?.toLowerCase()}
          />
        </div>
      )
    },
    {
      label: 'Team Lead',
      className: 'basis-3/6 lg:basis-1/5 overflow-hidden',
      render(row) {
        if (row.userAddress?.toLowerCase() === address?.toLowerCase()) {
          return (
            <div className="flex space-x-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.9987 1.66699C8.89363 1.66699 7.83382 2.10598 7.05242 2.88738C6.27102 3.66878 5.83203 4.72859 5.83203 5.83366C5.83203 6.93873 6.27102 7.99854 7.05242 8.77994C7.83382 9.56134 8.89363 10.0003 9.9987 10.0003C11.1038 10.0003 12.1636 9.56134 12.945 8.77994C13.7264 7.99854 14.1654 6.93873 14.1654 5.83366C14.1654 4.72859 13.7264 3.66878 12.945 2.88738C12.1636 2.10598 11.1038 1.66699 9.9987 1.66699ZM15.0074 11.667H4.98995C4.07578 11.667 3.33203 12.4107 3.33203 13.3249V13.9587C3.33203 15.3387 4.11745 16.532 5.54328 17.3182C6.72953 17.9732 8.31203 18.3337 9.9987 18.3337C13.2095 18.3337 16.6654 16.9645 16.6654 13.9587V13.3249C16.6654 12.4107 15.9216 11.667 15.0074 11.667Z"
                  fill="url(#paint0_linear_17429_1493)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_17429_1493"
                    x1="18.7853"
                    y1="10.0003"
                    x2="1.00403"
                    y2="11.2358"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F703D9" />
                    <stop offset="0.427083" stopColor="#795AF4" />
                    <stop offset="0.921875" stopColor="#04AEFC" />
                  </linearGradient>
                </defs>
              </svg>

              <p
                onClick={() => router.push(`/userprofile/${row.userAddress}`)}
                className="cursor-pointer overflow-hidden text-ellipsis bg-gradient-to-r from-gradientBlue to-gradientPink bg-clip-text text-b2e text-transparent">
                {row.username || trimAddress(row.userAddress)}
              </p>
            </div>
          );
        }
        return (
          <p
            onClick={() => router.push(`/userprofile/${row.userAddress}`)}
            className="cursor-pointer overflow-hidden text-ellipsis text-highEmphasis">
            {row.username || trimAddress(row.userAddress)}
          </p>
        );
      }
    },
    {
      label: 'No. of Referee',
      className: 'hidden md:block basis-1/3 lg:basis-1/6',
      render(row) {
        return <p className="text-b2e text-highEmphasis">{row.refereeCount}</p>;
      }
    },
    {
      label: (
        <div className="flex items-center space-x-1">
          <div className="hidden lg:block">
            <Tooltip
              content={
                <div className="max-w-[200px] text-b3">
                  <p>
                    The Team trade volume is the total notional trading volume (including open, add, partial close, and full close) in WETH
                    generated by all the referred users of each participant
                  </p>
                </div>
              }>
              <Image src="/images/components/airdrop/more-info.svg" width={12} height={12} alt="" />
            </Tooltip>
          </div>
          <div className="block lg:hidden">
            <MobileTooltip
              content={
                <p>
                  The Team trade volume is the total notional trading volume (including open, add, partial close, and full close) in WETH
                  generated by all the referred users of each participant
                </p>
              }>
              <Image src="/images/components/airdrop/more-info.svg" width={12} height={12} alt="" />
            </MobileTooltip>
          </div>
          <p>Team Trading Volume</p>
        </div>
      ),
      className: 'pr-5 lg:p-0 basis-3/6 lg:basis-1/5',
      render: row => {
        const val = Number(formatBigInt(row.totalVolume));
        let strVal = val.toFixed(2);
        if (Number(row.rank) === 0) strVal = '-'; // unranked
        return (
          <>
            <div className="flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e text-highEmphasis">{strVal}</p>
            </div>
            {row.userAddress?.toLowerCase() === address?.toLowerCase() ? (
              <div className="mt-4 flex justify-end space-x-[3px] text-primaryBlue lg:hidden" onClick={() => $isShowMobileMyTeam.set(true)}>
                <p className="text-b3e">View My Team</p>

                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12.5L10 8.5L6 4.5" stroke="#2574FB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : null}
          </>
        );
      }
    },
    {
      label: 'Team Prize',
      field: 'prize',
      className: 'hidden md:block lg:basis-3/12',
      render: row => {
        let usdtPrize = null;
        if (row.usdtPrize && row.usdtPrize > 0) usdtPrize = `${row.usdtPrize.toLocaleString()} USDT`;
        let pointPrize = null;
        if (row.pointPrize && row.pointPrize > 0) pointPrize = `${row.pointPrize.toLocaleString()}Pts`;

        const hasPrize = usdtPrize !== null || pointPrize !== null;

        let prize = '';
        if (usdtPrize && pointPrize) {
          prize = `${usdtPrize} + ${pointPrize}`;
        } else {
          prize = `${usdtPrize || ''}${pointPrize || ''}`;
        }
        if (!hasPrize) prize = '-';

        return (
          <div className={`flex w-fit space-x-1 text-b2 text-highEmphasis ${hasPrize ? 'rounded-[12px] bg-[#2E4371]' : ''} px-4 py-1`}>
            <Image src="/images/components/competition/revamp/gift.svg" width={16} height={16} alt="" />
            <p>{prize}</p>
          </div>
        );
      }
    }
  ];

  const renderTopThreeItem = (pos: number) => {
    const rank = rankingList.find(i => Number(i.rank) === pos);
    if (!rank) return null;
    const nameColor = pos === 1 ? 'text-[#FFD540]' : pos === 2 ? 'text-white' : pos === 3 ? 'text-[#FF8A65]' : '';

    const val = Number(formatBigInt(rank.totalVolume));

    // prize
    let usdtPrize = null;
    if (rank.usdtPrize && rank.usdtPrize > 0) usdtPrize = `${rank.usdtPrize.toLocaleString()} USDT`;
    let pointPrize = null;
    if (rank.pointPrize && rank.pointPrize > 0) pointPrize = `${rank.pointPrize.toLocaleString()}Pts`;

    const hasPrize = usdtPrize !== null || pointPrize !== null;

    let prize = '';
    if (usdtPrize && pointPrize) {
      prize = `${usdtPrize} + ${pointPrize}`;
    } else {
      prize = `${usdtPrize || ''}${pointPrize || ''}`;
    }
    if (!hasPrize) prize = '-';

    return (
      <TopThree.Item
        rank={pos}
        isYou={rank.userAddress?.toLowerCase() === userInfo?.userAddress.toLowerCase()}
        className={`${pos === 2 || pos === 3 ? 'mt-8' : ''} min-w-[200px]`}
        title={
          <p onClick={() => router.push(`/userprofile/${rank.userAddress}`)} className={`mb-4 cursor-pointer text-h5 ${nameColor}`}>
            {trimString(rank.username, 12) || trimAddress(rank.userAddress)}
          </p>
        }>
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Team Trading Volume</p>
        <div className="mb-3 flex space-x-1">
          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
          <p className="text-b2e">{val.toFixed(2)}</p>
        </div>
        <p className="mb-[6px] text-b3 text-mediumEmphasis">No. of Referee</p>
        <p className="text-b2e">{rank.refereeCount}</p>
        <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Team Prize</p>
        <p className="text-b2 text-highEmphasis">{prize}</p>
      </TopThree.Item>
    );
  };

  const copyTextFunc = (text: any) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    }
  };

  const copyCode = (targetElement: any, text = '', isUrlOnly = true) => {
    copyTextFunc(`${isUrlOnly ? 'https://app.tribe3.xyz/airdrop/refer?ref=' : ''}${text || referralCode}`);
  };

  const shareToCopyText = () => `📢 Use my referral link to enjoy extra Tribe3 points!
  🎉 Long & short Blue-chips NFTs with leverage at any amount on ${referralCode?.toUpperCase()}`;

  const shareToTwitter = () => {
    // logHelper('reward_my_referral_code_share_twitter_pressed', walletProvider.holderAddress, { page: 'Reward' });
    setIsShowShareModal(false);
    const encodeItem = `🎉 Long & short Blue-chips NFTs with leverage at any amount on
      https://app.tribe3.xyz/airdrop/refer?ref=${referralCode?.toUpperCase()}
      \n📢 Use my referral link to enjoy extra Tribe3 points!
      \n@Tribe3Official`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(encodeItem)}`);
  };

  function showSnackBar() {
    const snackbar = document.getElementById('snackbar');
    if (snackbar) {
      snackbar.className = 'snackbar show';
      copyTextFunc(`https://app.tribe3.xyz/airdrop/refer?ref=${referralCode || ''}`);
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
      }, 3000);
    }
  }

  return (
    <div className="relative">
      <FloatingWidget.Container>
        <FloatingWidget.Item>
          <div className="mb-4 flex space-x-1">
            {/* <Image src="/images/components/competition/revamp/leaderboard.svg" width={16} height={16} alt="" /> */}
            <p className="text-h5 text-highEmphasis">Top Referrer</p>
          </div>
          <Image src="/images/components/competition/revamp/timer.svg" className="mb-1" width={16} height={16} alt="" />
          <p className="text-b3 text-highEmphasis">
            Ends in:{' '}
            <span className="text-b3e">
              <CountdownTimer date="2023-09-12T20:00:00.000+08:00" timeZone="Asia/Hong_Kong" />
            </span>
          </p>
        </FloatingWidget.Item>
      </FloatingWidget.Container>

      <div className="mx-auto lg:max-w-[929px]">
        <PrizePool />

        <TopThree.Container>
          {renderTopThreeItem(2)}
          {renderTopThreeItem(1)}
          {renderTopThreeItem(3)}
        </TopThree.Container>

        <Table
          className="lg:mb-[120px]"
          headerClassName="sticky top-12 z-[2] text-b3 py-4 lg:static lg:text-b2"
          rowClassName="!items-start md:!items-center hover:bg-secondaryBlue"
          bodyClassName="lg:h-[480px]"
          columns={tableColumns}
          data={isMobileScreen ? rankingList : rankingList.filter(i => Number(i.rank) > 3)}
          fixedRow={isConnected ? userRank : null}
        />
      </div>

      <div className="hidden space-y-32 md:block">
        {isConnected ? (
          <>
            <MyTeam
              copyTextFunc={copyTextFunc}
              referralCode={referralCode}
              displayUsername={displayUsername}
              setIsShowShareModal={setIsShowShareModal}
              referralTeamList={referralTeamList}
              referralUserItem={referralUserItem}
            />
            {myRefererUserItem ? (
              <>
                <MyReferrersTeam
                  myRefererUserItem={myRefererUserItem}
                  myRefererTeamList={myRefererTeamList}
                  setIsShowReferralModal={setIsShowReferralModal}
                />
                <ReferreeModal
                  myRefererTeamList={myRefererTeamList}
                  isShowReferralModal={isShowReferralModal}
                  setIsShowReferralModal={setIsShowReferralModal}
                />
              </>
            ) : null}
          </>
        ) : null}
        <Rules />
      </div>

      <MobileDrawer
        title="Referral Team I Joined"
        show={isShowMobileMyReferrerTeam}
        onClickBack={() => $isShowMobileMyReferrerTeam.set(false)}>
        <MyReferrersTeamMobile myRefererUserItem={myRefererUserItem} myRefererTeamList={myRefererTeamList} />
        {myRefererUserItem ? (
          <ContributionDetailsMobile myRefererTeamList={myRefererTeamList} myRefererUserItem={myRefererUserItem} />
        ) : null}
      </MobileDrawer>

      <MobileDrawer title="My Referral Team" show={isShowMobileMyTeam} onClickBack={() => $isShowMobileMyTeam.set(false)}>
        <MyTeam
          copyTextFunc={copyTextFunc}
          referralCode={referralCode}
          displayUsername={displayUsername}
          setIsShowShareModal={setIsShowShareModal}
          referralTeamList={referralTeamList}
          referralUserItem={referralUserItem}
        />
      </MobileDrawer>

      <MobileDrawer title="Rules - Top Referrer" show={isShowMobileRules} onClickBack={() => $isShowMobileRules.set(false)}>
        <Rules />
      </MobileDrawer>

      {isShowShareModal ? (
        <ShareModal
          setIsShow={setIsShowShareModal}
          referralCode={referralCode}
          copyCode={copyCode}
          shareToTwitter={shareToTwitter}
          shareToCopyText={shareToCopyText}
        />
      ) : null}
      {isShowMobileShareModal ? (
        <ShareMobileModal setIsShow={setIsShowMobileShareModal} referralCode={referralCode} copyCode={copyCode} />
      ) : null}

      <div className="snackbar" id="snackbar">
        Referral link copied to clipboard!
      </div>
    </div>
  );
};

export default TopReferrer;
