/* eslint-disable no-unused-vars */
import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
import TopThree from './TopThree';
import FloatingWidget from './FloatingWidget';
import Table, { TableColumn } from './Table';
import Rules from './Rules';
import UserMedal from '../common/UserMedal';

type Data = {
  rank: number;
  username: string;
  realized_pnl: number;
  prize: number;
};

// define tables columns
const tableColumns: TableColumn<Data>[] = [
  {
    label: 'Rank',
    className: 'basis-1/4 text-center',
    render: row => (
      <div className="flex basis-1/4 justify-center">
        <UserMedal rank={row.rank} isYou={row.rank === 30} />
      </div>
    )
  },
  { label: 'User', field: 'username', className: 'basis-1/4' },
  {
    label: 'Realized P/L',
    field: 'realized_pnl',
    className: 'basis-1/4 text-center',
    render: row => (
      <div className="flex justify-center space-x-1">
        <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
        <p className="text-b2e text-marketGreen">{row.realized_pnl}</p>
      </div>
    )
  },
  {
    label: 'Prize',
    field: 'prize',
    className: 'basis-1/4',
    render: row => (
      <div className="flex w-fit space-x-1 rounded-[12px] bg-[#2E4371] px-4 py-1">
        <Image src="/images/components/competition/revamp/gift.svg" width={16} height={16} alt="" />
        <p className="text-b2">{row.prize} USDT</p>
      </div>
    )
  }
];

// data, usually from APIs
const tableData: Data[] = [
  { rank: 1, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 2, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 3, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 4, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 5, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 6, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 7, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 8, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 9, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
  { rank: 10, username: '0xbf44b...980', realized_pnl: 8.99, prize: 200 },
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
  const router = useRouter();
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
        <TopThree.Container>
          <TopThree.Item rank={2} className="mt-8 w-[200px]" title={<p className="mb-4 text-h5 text-white">JEFFGPT8888</p>}>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Total Trading Vol.</p>
            <div className="flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e text-marketGreen">+89.99</p>
            </div>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
          <TopThree.Item rank={1} className="w-[200px]" title={<p className="mb-4 text-h5 text-[#FFD540]">JEFFGPT9999</p>}>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Total Trading Vol.</p>
            <div className="flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e text-marketGreen">+99.99</p>
            </div>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
          <TopThree.Item rank={3} className="mt-8 w-[200px]" title={<p className="mb-4 text-h5 text-[#FF8A65]">JEFFGPT7777</p>}>
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Total Trading Vol.</p>
            <div className="flex space-x-1">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
              <p className="text-b2e text-marketGreen">+79.99</p>
            </div>
            <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
            <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
            <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
          </TopThree.Item>
        </TopThree.Container>

        <Table className="mb-[170px]" columns={tableColumns} data={tableData} fixedRow={userData} />

        <Rules />
      </div>
    </div>
  );
};

export default TopGainer;
