/* eslint-disable import/no-extraneous-dependencies */
// @ts-nocheck
import React from 'react';
import Image from 'next/image';
import { RadialChart } from 'react-vis';
import { useStore as useNanostore } from '@nanostores/react';
import { $psBalance, $psShowBalance } from '@/stores/portfolio';
import { $userIsConnected } from '@/stores/user';

function AccountChartMobile() {
  const psBalance = useNanostore($psBalance);
  const isConnected = useNanostore($userIsConnected);
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
    <div className="w-full bg-lightBlue px-5 py-9">
      <div className="flex">
        <div>
          <div className="flex items-center">
            <div className="mr-[6px] h-[8px] w-[8px] rounded-full bg-primaryBlue" />
            <div className="text-[14px] font-medium text-mediumEmphasis">Portfolio Collateral</div>
          </div>
          <div className="mb-[40px] flex">
            <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
            <span className="ml-[6px] text-[20px] font-semibold text-highEmphasis">
              {isConnected ? (!isShowBalance ? '****' : psBalance.portfolio) : '-.--'}
            </span>
          </div>
        </div>

        <div className="ml-[45px]">
          <div className="flex items-center">
            <div className="mr-[6px] h-[8px] w-[8px] rounded-full bg-primaryPink" />
            <div className="text-[14px] font-medium text-mediumEmphasis">Wallet Balance</div>
          </div>
          <div className="flex">
            <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
            <span className="ml-[6px] text-[20px] font-semibold text-highEmphasis">
              {isConnected ? (!isShowBalance ? '****' : psBalance.available) : '-.--'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="donut-chart relative flex justify-center">
          <RadialChart data={isConnected ? chartData : emptyChartData} innerRadius={90} radius={100} width={200} height={200} animation />
          <div className="absolute top-[72px] w-full">
            <div className="mb-[6px] flex items-center justify-center">
              <span className="text-[12px] font-medium text-mediumEmphasis">Total Account Value</span>
              <Image
                src={isShowBalance ? '/images/components/portfolio/show_balance.svg' : '/images/components/portfolio/hide_balance.svg'}
                alt=""
                className="ml-1 cursor-pointer opacity-50"
                width={16}
                height={16}
                onClick={toggleBalance}
              />
            </div>
            <div className="flex items-center justify-center">
              <Image src="/images/common/symbols/eth-tribe3.svg" width={20} height={20} alt="" />
              <span className="ml-[6px] text-[20px] font-semibold">{isConnected ? (isShowBalance ? totalBalance : '****') : '-.--'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountChartMobile;
