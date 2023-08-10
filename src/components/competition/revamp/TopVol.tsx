/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Image from 'next/image';
import { $isShowMobileRules, $topVolActiveWeek } from '@/stores/competition';
import { useStore } from '@nanostores/react';
import Tooltip from '@/components/common/Tooltip';
import { $userIsConnected } from '@/stores/user';
import { useAccount } from 'wagmi';
import { $topVolumeRankingList, $topVolumeUserItem, TopVolumeRanking } from '@/stores/revampCompetition';
import { trimAddress, trimString } from '@/utils/string';
import { formatBigInt } from '@/utils/bigInt';
import TopThree from './TopThree';
import FloatingWidget from './FloatingWidget';
import Table, { TableColumn } from './Table';
import Rules from './TopVol/Rules';
import UserMedal from '../common/UserMedal';
import PrizePool from './TopVol/PrizePool';
import MobileDrawer from './MobileDrawer';

type WeekData = {
  title: string;
  isEnded: boolean;
  isOngoing: boolean;
  startDate: string;
  endDate: string;
};

const weeksData: WeekData[] = [
  {
    title: 'Week 1',
    isEnded: true,
    isOngoing: false,
    startDate: '15 Aug',
    endDate: '22 Aug'
  },
  {
    title: 'Week 2',
    isEnded: false,
    isOngoing: true,
    startDate: '15 Aug',
    endDate: '22 Aug'
  },
  {
    title: 'Week 3',
    isEnded: false,
    isOngoing: false,
    startDate: '22 Aug',
    endDate: '22 Aug'
  },
  {
    title: 'Week 4',
    isEnded: false,
    isOngoing: false,
    startDate: '8 Sep',
    endDate: '22 Sep'
  }
];

const TopVol = () => {
  const { address } = useAccount();
  const isConnected = useStore($userIsConnected);
  const isShowMobileRules = useStore($isShowMobileRules);
  const topVolActiveWeek = useStore($topVolActiveWeek);

  const rankingList = useStore($topVolumeRankingList);
  const userRank = useStore($topVolumeUserItem);

  useEffect(() => {
    console.log({ rankingList, userRank });
  }, [rankingList, userRank]);

  // define tables columns
  const tableColumns: TableColumn<TopVolumeRanking>[] = [
    {
      label: 'Rank',
      className: 'pl-5 lg:p-0 basis-1/3 lg:basis-1/4 text-left lg:text-center',
      render: row => (
        <div className="flex basis-1/4 lg:justify-center">
          <UserMedal rank={row.rank} isYou={row.userAddress?.toLowerCase() === address?.toLowerCase()} />
        </div>
      )
    },
    {
      label: 'User',
      className: 'basis-1/3 lg:basis-1/4',
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

              <p className="bg-gradient-to-r from-gradientBlue to-gradientPink bg-clip-text text-b2e text-transparent">{row.username}</p>
            </div>
          );
        }
        return <p className="text-highEmphasis">{row.username || trimAddress(row.userAddress)}</p>;
      }
    },
    {
      label: (
        <div className="flex items-center justify-end space-x-1 lg:justify-center">
          <Tooltip
            content={
              <div className="max-w-[230px] text-b3">
                <p>The total notional trading volume (open, add, partial close and full close would be counted) in WETH</p>
              </div>
            }>
            <Image src="/images/components/airdrop/more-info.svg" width={12} height={12} alt="" />
          </Tooltip>
          <p>Total Trading Vol.</p>
        </div>
      ),
      className: 'pr-5 lg:p-0 basis-1/3 lg:basis-1/4 text-right lg:text-center',
      render: row => {
        const val = Number(formatBigInt(row.weeklyTradedVolume));
        return (
          <div className="flex justify-end space-x-1 lg:justify-center">
            <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
            <p className="text-b2e text-highEmphasis">{val.toFixed(2)}</p>
          </div>
        );
      }
    },
    {
      label: 'Prize',
      className: 'hidden md:block basis-1/4',
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

    // realized pnl
    const val = Number(formatBigInt(rank.weeklyTradedVolume));

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
        className={`${pos === 2 || pos === 3 ? 'mt-8' : ''} min-w-[200px]`}
        title={<p className={`mb-4 text-h5 ${nameColor}`}>{trimString(rank.username, 12) || trimAddress(rank.userAddress)}</p>}>
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Total Trading Vol.</p>
        <div className="flex space-x-1">
          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
          <p className="text-b2e text-highEmphasis">{val.toFixed(2)}</p>
        </div>
        <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
        <p className="text-b2 text-highEmphasis">{prize}</p>
      </TopThree.Item>
    );
  };

  const renderCurrentWeek = () => {
    const currentWeek = weeksData.at(topVolActiveWeek);
    if (!currentWeek) return null;

    const isVisible = currentWeek.isEnded || currentWeek.isOngoing;

    if (!isVisible) {
      // coming soon
      return (
        <div className="py-16 text-center">
          <p className="mb-6 text-h4 text-highEmphasis">Coming Soon!</p>
          <p className="text-b1 text-mediumEmphasis">
            {currentWeek.title} starts in {currentWeek.startDate}.
          </p>
        </div>
      );
    }

    // render current week
    return (
      <>
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
            rowClassName="hover:bg-secondaryBlue"
            bodyClassName="lg:h-[480px]"
            columns={tableColumns}
            data={rankingList}
            fixedRow={isConnected ? userRank : null}
          />
        </div>

        <div className="hidden md:block">
          <Rules />
        </div>

        <MobileDrawer title="Rules - Top Vol" show={isShowMobileRules} onClickBack={() => $isShowMobileRules.set(false)}>
          <Rules />
        </MobileDrawer>
      </>
    );
  };

  return (
    <div className="relative">
      <FloatingWidget.Container>
        {weeksData.map((d, i) => (
          <FloatingWidget.Item
            key={d.title}
            onClick={() => $topVolActiveWeek.set(i)}
            className={`${
              topVolActiveWeek === i ? '!bg-primaryBlue' : ''
            } relative min-h-[84px] cursor-pointer justify-between hover:!bg-primaryBlueHover`}>
            {d.isEnded && (
              <div
                className="absolute right-[-3px] top-[-2px] rounded-br-[6px] rounded-tl-[6px] 
                bg-gradient-to-r from-gradientBlue to-gradientPink 
                px-[3px] py-[2px] text-[7.5px] font-bold leading-[7.5px]">
                END
              </div>
            )}
            <div className="mb-4 flex space-x-1">
              <p className="text-h5 text-highEmphasis">{d.title}</p>
            </div>
            {d.isEnded ? (
              <p className="text-b3 text-highEmphasis">
                {d.startDate} - {d.endDate}
              </p>
            ) : d.isOngoing ? (
              <>
                <Image src="/images/components/competition/revamp/timer.svg" className="mb-1" width={16} height={16} alt="" />
                <p className="text-b3 text-highEmphasis">
                  Ends in: <span className="text-b3e">4d 3h 12m</span>
                </p>
              </>
            ) : (
              <p className="text-b3 text-highEmphasis">Start in {d.startDate}</p>
            )}
          </FloatingWidget.Item>
        ))}
      </FloatingWidget.Container>

      <div className="flex space-x-3 overflow-auto px-5 py-4 md:hidden">
        {weeksData.map(({ title, isEnded }, i) => (
          <div
            onClick={() => $topVolActiveWeek.set(i)}
            className={`relative flex min-w-[100px] flex-col items-center rounded  p-3 text-b3 ${
              topVolActiveWeek === i ? 'bg-primaryBlue' : 'bg-secondaryBlue'
            }`}>
            {title}
            {isEnded && (
              <div
                className="absolute right-[-3px] top-[-2px] rounded-br-[6px] rounded-tl-[6px] 
                bg-gradient-to-r from-gradientBlue to-gradientPink 
                px-[3px] py-[2px] text-[7.5px] font-bold leading-[7.5px]">
                END
              </div>
            )}
          </div>
        ))}
      </div>

      {renderCurrentWeek()}
    </div>
  );
};

export default TopVol;
