/* eslint-disable no-unused-vars */
import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
import { useStore } from '@nanostores/react';
import { $isShowMobileRules } from '@/stores/competition';
import TopThree from './TopThree';
import FloatingWidget from './FloatingWidget';
import Table, { TableColumn } from './Table';
import Rules from './TopGainer/Rules';
import UserMedal from '../common/UserMedal';
import PrizePool from './TopGainer/PrizePool';
import MobileDrawer from './MobileDrawer';

type Data = {
  rank: number;
  username: string;
  realized_pnl: number;
  prize?: number;
  prize_points?: number;
};

// define tables columns
const tableColumns: TableColumn<Data>[] = [
  {
    label: 'Rank',
    className: 'pl-5 lg:p-0 basis-1/3 lg:basis-1/4 text-left lg:text-center',
    render: row => (
      <div className="flex basis-1/4 lg:justify-center">
        <UserMedal rank={row.rank} isYou={row.rank === 30} />
      </div>
    )
  },
  { label: 'User', field: 'username', className: 'basis-1/3 lg:basis-1/4' },
  {
    label: (
      <div className="flex items-center justify-end space-x-1 lg:justify-center">
        <Image src="/images/components/airdrop/more-info.svg" width={12} height={12} alt="" />
        <p>Realized P/L</p>
      </div>
    ),
    field: 'realized_pnl',
    className: 'pr-5 lg:p-0 basis-1/3 lg:basis-1/4 text-right lg:text-center',
    render: row => (
      <div className="flex justify-end space-x-1 lg:justify-center">
        <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
        <p className="text-b2e text-marketGreen">{row.realized_pnl}</p>
      </div>
    )
  },
  {
    label: 'Prize',
    field: 'prize',
    className: 'hidden md:block basis-1/4',
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
  { rank: 1, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 2, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 3, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 4, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200, prize_points: 1500 },
  { rank: 5, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 6, username: '0xbf44b...980', realized_pnl: 8.99, prize: 0 },
  { rank: 7, username: '0xbf44b...980', realized_pnl: 8.99 },
  { rank: 8, username: '0xbf44b...980', realized_pnl: 8.99 },
  { rank: 9, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 10, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200, prize_points: 1500 },
  { rank: 11, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 12, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 13, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 14, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 15, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 16, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 17, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 18, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 19, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 20, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 21, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 }
];

const userData = { rank: 30, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 };

const TopGainer = () => {
  const isShowMobileRules = useStore($isShowMobileRules);

  return (
    <div className="relative">
      <FloatingWidget.Container>
        <FloatingWidget.Item>
          <div className="mb-4 flex space-x-1">
            <Image src="/images/components/competition/revamp/leaderboard.svg" width={16} height={16} alt="" />
            <p className="text-h5 text-highEmphasis">Top Gainer</p>
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
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Realized P/L</p>
            <div className="flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e text-marketGreen">+89.99</p>
            </div>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
          <TopThree.Item rank={1} className="w-[200px]" title={<p className="mb-4 text-h5 text-[#FFD540]">JEFFGPT9999</p>}>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Realized P/L</p>
            <div className="flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e text-marketGreen">+99.99</p>
            </div>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
          <TopThree.Item rank={3} className="mt-8 w-[200px]" title={<p className="mb-4 text-h5 text-[#FF8A65]">JEFFGPT7777</p>}>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Realized P/L</p>
            <div className="flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e text-marketGreen">+79.99</p>
            </div>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
        </TopThree.Container>

        <Table
          className="lg:mb-[120px]"
          headerClassName="sticky top-12 z-[2] text-b3 py-4 lg:static lg:text-b2"
          rowClassName="hover:bg-secondaryBlue"
          columns={tableColumns}
          data={tableData}
          fixedRow={userData}
        />
      </div>

      <div className="hidden md:block">
        <Rules />
      </div>

      <MobileDrawer title="Rules - Top Gainer" show={isShowMobileRules} onClickBack={() => $isShowMobileRules.set(false)}>
        <Rules />
      </MobileDrawer>
    </div>
  );
};

export default TopGainer;
