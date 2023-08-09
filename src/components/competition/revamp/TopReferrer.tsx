/* eslint-disable no-unused-vars */
import React from 'react';
import Image from 'next/image';
import { useStore } from '@nanostores/react';
import { $isShowMobileMyReferrerTeam, $isShowMobileMyTeam, $isShowMobileRules } from '@/stores/competition';
import TopThree from './TopThree';
import FloatingWidget from './FloatingWidget';
import Table, { TableColumn } from './Table';
import UserMedal from '../common/UserMedal';
import PrizePool from './TopReferrer/PrizePool';
import Rules from './TopReferrer/Rules';
import MobileDrawer from './MobileDrawer';
import MyTeam from './TopReferrer/MyTeam';
import MyReferrersTeam from './TopReferrer/MyReferrersTeam';
import { ContributionDetail } from './TopReferrer/ContributionDetail';

type Data = {
  rank: number;
  username: string;
  num_ref: number;
  total_tradingvol: number;
  prize?: number;
  prize_points?: number;
};

// define tables columns
const tableColumns: TableColumn<Data>[] = [
  {
    label: 'Rank',
    className: 'pl-5 lg:p-0 basis-1/3 lg:basis-1/5 text-left lg:text-center',
    render: row => (
      <div className="flex basis-1/4 lg:justify-center">
        <UserMedal rank={row.rank} isYou={row.rank === 30} />
      </div>
    )
  },
  {
    label: 'Team Lead',
    className: 'basis-1/3 lg:basis-1/5',
    render(row) {
      return <p className="text-highEmphasis">{row.username}</p>;
    }
  },
  {
    label: 'No. of Member',
    className: 'hidden md:block basis-1/3 lg:basis-1/6',
    render(row) {
      return <p className="text-b2e text-highEmphasis">{row.num_ref}</p>;
    }
  },
  {
    label: (
      <div className="flex items-center justify-end space-x-1 lg:justify-center">
        <Image src="/images/components/airdrop/more-info.svg" width={12} height={12} alt="" />
        <p>Team Trad. Vol.</p>
      </div>
    ),
    field: 'total_tradingvol',
    className: 'pr-5 lg:p-0 basis-1/3 lg:basis-1/5 text-right lg:text-center',
    render: row => (
      <>
        <div className="flex justify-end space-x-1 lg:justify-center">
          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
          <p className="text-b2e text-highEmphasis">{row.total_tradingvol}</p>
        </div>
        {row.username === 'Me' ? (
          <div className="mt-4 flex justify-end space-x-[3px] text-primaryBlue lg:hidden" onClick={() => $isShowMobileMyTeam.set(true)}>
            <p className="text-b3e">View My Team</p>

            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12.5L10 8.5L6 4.5" stroke="#2574FB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : null}
      </>
    )
  },
  {
    label: 'Team Prize',
    field: 'prize',
    className: 'hidden md:block',
    render: row => {
      let usdtPrize = null;
      if (row.prize && row.prize > 0) usdtPrize = `${row.prize} USDT`;
      let pointPrize = null;
      if (row.prize_points && row.prize_points > 0) pointPrize = `${row.prize_points}Pts`;

      const hasPrize = usdtPrize !== null || pointPrize !== null;

      let prize = '';
      if (usdtPrize) prize += ` ${usdtPrize}`;
      if (pointPrize) prize += ` + ${pointPrize}`;
      if (!hasPrize) prize = '-';

      return (
        <div className={`flex w-fit space-x-1 text-b2 ${hasPrize ? 'rounded-[12px] bg-[#2E4371]' : ''} px-4 py-1`}>
          <Image src="/images/components/competition/revamp/gift.svg" width={16} height={16} alt="" />
          <p>{prize}</p>
        </div>
      );
    }
  }
];

// data, usually from APIs
const tableData: Data[] = [
  { rank: 1, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 2, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 3, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 4, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200, prize_points: 1500 },
  { rank: 5, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 6, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 0 },
  { rank: 7, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99 },
  { rank: 8, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99 },
  { rank: 9, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 10, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200, prize_points: 1500 },
  { rank: 11, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 12, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 13, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 14, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 15, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 16, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 17, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 18, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 19, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 20, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 },
  { rank: 21, username: '0xbf44b...980', num_ref: 2, total_tradingvol: 8.99, prize: 200 }
];

const userData = { rank: 30, username: 'Me', num_ref: 2, total_tradingvol: 8.99, prize: 200 };

const TopReferrer = () => {
  const isShowMobileMyTeam = useStore($isShowMobileMyTeam);
  const isShowMobileMyReferrerTeam = useStore($isShowMobileMyReferrerTeam);
  const isShowMobileRules = useStore($isShowMobileRules);

  return (
    <div className="relative">
      <FloatingWidget.Container>
        <FloatingWidget.Item>
          <div className="mb-4 flex space-x-1">
            <Image src="/images/components/competition/revamp/leaderboard.svg" width={16} height={16} alt="" />
            <p className="text-h5 text-highEmphasis">Top Referrer</p>
          </div>
          <Image src="/images/components/competition/revamp/timer.svg" className="mb-1" width={16} height={16} alt="" />
          <p className="text-b3 text-highEmphasis">
            Ends in: <span className="text-b3e">4d 3h 12m</span>
          </p>
        </FloatingWidget.Item>
      </FloatingWidget.Container>

      <div className="mx-auto lg:max-w-[929px]">
        <PrizePool />

        <TopThree.Container>
          <TopThree.Item rank={2} className="mt-8 w-[200px]" title={<p className="mb-4 text-h5 text-white">JEFFGPT8888</p>}>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Team Trad. Vol.</p>
            <div className="mb-3 flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e">89.99</p>
            </div>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">No. of Member</p>
            <p className="text-b2e">12</p>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Team Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
          <TopThree.Item rank={1} className="w-[200px]" title={<p className="mb-4 text-h5 text-[#FFD540]">JEFFGPT9999</p>}>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Team Trad. Vol.</p>
            <div className="mb-3 flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e">99.99</p>
            </div>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">No. of Member</p>
            <p className="text-b2e">13</p>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Team Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
          <TopThree.Item rank={3} className="mt-8 w-[200px]" title={<p className="mb-4 text-h5 text-[#FF8A65]">JEFFGPT7777</p>}>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Team Trad. Vol.</p>
            <div className="mb-3 flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e">79.99</p>
            </div>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">No. of Member</p>
            <p className="text-b2e">3</p>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Team Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
        </TopThree.Container>

        <Table
          className="lg:mb-[120px]"
          headerClassName="sticky top-12 z-[2] text-b3 py-4 lg:static lg:text-b2"
          rowClassName="!items-start md:!items-center hover:bg-secondaryBlue"
          columns={tableColumns}
          data={tableData}
          fixedRow={userData}
        />
      </div>

      <div className="hidden space-y-32 md:block">
        <MyTeam />
        <MyReferrersTeam />
        <Rules />
      </div>

      <MobileDrawer title="My Referrer's Team" show={isShowMobileMyReferrerTeam} onClickBack={() => $isShowMobileMyReferrerTeam.set(false)}>
        <MyReferrersTeam />
        <ContributionDetail />
      </MobileDrawer>

      <MobileDrawer title="My Team" show={isShowMobileMyTeam} onClickBack={() => $isShowMobileMyTeam.set(false)}>
        <MyTeam />
      </MobileDrawer>

      <MobileDrawer title="Rules - Top Referrer" show={isShowMobileRules} onClickBack={() => $isShowMobileRules.set(false)}>
        <Rules />
      </MobileDrawer>
    </div>
  );
};

export default TopReferrer;
