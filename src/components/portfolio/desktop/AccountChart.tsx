/* eslint-disable import/no-extraneous-dependencies */
// @ts-nocheck
import React from 'react';
import Image from 'next/image';
import { RadialChart } from 'react-vis';
import { useStore as useNanostore } from '@nanostores/react';
import { $psBalance, $psShowBalance } from '@/stores/portfolio';
import { $userIsConnected } from '@/stores/user';

function AccountChart() {
  const isConnected = useNanostore($userIsConnected);
  const psBalance = useNanostore($psBalance);
  const isShowBalance = useNanostore($psShowBalance);

  const emptyChartData = [
    {
      angle: 1,
      style: {
        stroke: 'rgba(45, 47, 82, 1)',
        fill: 'rgba(45, 47, 82, 1)'
      }
    }
  ];
  const chartData = [
    {
      angle: Number(psBalance.portfolio),
      style: {
        stroke: 'rgba(37, 116, 251, 1)',
        fill: 'rgba(37, 116, 251, 1)'
      }
    },
    {
      angle: Number(psBalance.available),
      style: {
        stroke: 'rgb(255, 66, 202)',
        fill: 'rgb(255, 66, 202)'
      }
    }
  ];

  const toggleBalance = () => {
    $psShowBalance.set(!isShowBalance);
  };
  const totalBalance = !psBalance ? '-.--' : (Number(psBalance.portfolio) + Number(psBalance.available)).toFixed(4);

  return (
    <div
      className="flex w-full justify-center rounded-[12px] bg-lightBlue p-9
      2xl:block 2xl:w-[540px]">
      <div>
        <div className="flex items-center ">
          <div className="h-[20px] w-[3px] rounded-[1px] bg-primaryBlue" />
          <div className="ml-2 text-[20px] font-semibold text-highEmphasis">Account Overview</div>
        </div>

        <div className="mt-[33px] flex">
          <div className="donut-chart relative">
            <RadialChart
              data={isConnected ? chartData : emptyChartData}
              innerRadius={110}
              radius={125}
              width={250}
              height={250}
              animation
            />
            <div className="absolute left-[34px] top-[97px]">
              <div className="flex justify-center">
                <span className="text-[16px] font-medium text-mediumEmphasis">Total Account Value</span>
                <Image
                  src={isShowBalance ? '/images/components/portfolio/show_balance.svg' : '/images/components/portfolio/hide_balance.svg'}
                  alt=""
                  className="ml-1 cursor-pointer opacity-50"
                  width={16}
                  height={10}
                  onClick={toggleBalance}
                />
              </div>
              <div className="flex items-center justify-center">
                <Image src="/images/common/symbols/eth-tribe3.svg" width={20} height={20} alt="" />
                <span className="ml-[6px] text-[24px] font-semibold">{isConnected ? (isShowBalance ? totalBalance : '****') : '-.--'}</span>
              </div>
            </div>
          </div>

          <div className="ml-9 mt-[50px]">
            <div className="mb-[14px] flex items-center">
              <div className="mr-2 h-[9px] w-[9px] rounded-full bg-primaryBlue" />
              <div className="text-[16px] font-medium text-mediumEmphasis">Portfolio Collateral</div>
            </div>
            <div className="mb-[40px] ml-4 flex">
              <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
              <span className="ml-[6px] text-[20px] font-semibold text-highEmphasis">
                {isConnected ? (!isShowBalance ? '****' : psBalance.portfolio) : '-.--'}
              </span>
            </div>
            <div className="mb-[14px] flex items-center">
              <div className="mr-2 h-[9px] w-[9px] rounded-full bg-primaryPink" />
              <div className="text-[16px] font-medium text-mediumEmphasis">Wallet Balance</div>
            </div>
            <div className="ml-4 flex">
              <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
              <span className="ml-[6px] text-[20px] font-semibold text-highEmphasis">
                {isConnected ? (!isShowBalance ? '****' : psBalance.available) : '-.--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountChart;
