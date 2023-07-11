import React from 'react';
import Image from 'next/image';
import CustomTable from '@/components/competition/desktop/CustomTable';
import { useStore as useNanostore } from '@nanostores/react';
import {
  $firstLeaderboard,
  $flCurrentUser,
  $isCompetitionLeaderboardLoading,
  $secondLeaderboard,
  $slCurrentUser,
  $thirdLeaderboard,
  $tlCurrentUser
} from '@/stores/competition';
import CustomValue from '@/components/competition/common/CustomValue';
import { localeConversion } from '@/utils/localeConversion';
import { formatBigInt } from '@/utils/bigInt';
import CustomReward from '@/components/competition/common/CustomReward';

const Leaderboard = (props: any) => {
  const firstLeaderboardData = useNanostore($firstLeaderboard);
  const flCurrentUserData = useNanostore($flCurrentUser);
  const secondLeaderboardData = useNanostore($secondLeaderboard);
  const slCurrentUserData = useNanostore($slCurrentUser);
  const thirdLeaderboardData = useNanostore($thirdLeaderboard);
  const tlCurrentUserData = useNanostore($tlCurrentUser);
  const isCompetitionLeaderboardLoadingData = useNanostore($isCompetitionLeaderboardLoading);

  return (
    <div className="container mb-9 flex h-[456px] w-full flex-wrap items-center gap-[25px] px-0">
      <CustomTable
        data={firstLeaderboardData}
        userData={flCurrentUserData}
        selectedField="pnl"
        tableClassName="flex-1 pt-[39px] rounde-md border border-white border-opacity-20 rounded-md
                bg-[url('/images/components/competition/backgrounds/gainers.svg')] bg-no-repeat bg-contain"
        titleClassName="flex justify-between mb-[18px] px-[25px] min-[1024px]:px-[36px]"
        tHeadClassName="flex text-b2 text-mediumEmphasis px-[25px] min-[1024px]:px-[36px]"
        tBodyClassName="scroll-style mt-6 overflow-y-scroll h-[320px] px-[25px] min-[1024px]:px-[36px]"
        icon={<Image alt="gainers icon" src="/images/components/competition/icons/gainers.svg" width={22} height={22} />}
        title={<h4 className="pl-[7px] text-h4">Top ROI</h4>}
        isLoading={isCompetitionLeaderboardLoadingData}
        thirdRowTitle="Realized P/L%"
        thirdRowTips="Realized P/L divided by the maximum total collateral pledged across all opened 
        positions at any given point in time during the competition."
        thirdRowValueGenerator={(value: string) =>
          CustomValue({
            ethIcon: false,
            value: `${Number(localeConversion(value, 2)) > 0 ? '+' : ''}${
              Math.abs(Number(localeConversion(value, 2))) === 0 ? '0.00' : localeConversion(value, 2)
            } %`
          })
        }
        reward={
          <CustomReward
            prizeLeftText="Prize Pool for Top 10:"
            prizeRightText="52,000 Tribe3 Pts"
            mainClassName="px-[25px] min-[1024px]:px-[36px]"
            mainStyle={{
              background:
                'linear-gradient(270deg, rgba(154, 232, 76, 0.1) 0%, rgba(154, 232, 76, 0.25) 51.04%, rgba(154, 232, 76, 0.1) 100%)'
            }}
          />
        }
        bottomShadowPosition="0"
      />
      <CustomTable
        data={secondLeaderboardData}
        userData={slCurrentUserData}
        selectedField="netConvergenceVol"
        tableClassName="flex-1 pt-[39px] rounde-md border border-white border-opacity-20 rounded-md
                bg-[url('/images/components/competition/backgrounds/convergence.svg')] bg-no-repeat bg-contain"
        titleClassName="flex justify-between mb-[18px] px-[25px] min-[1024px]:px-[36px]"
        tHeadClassName="flex text-b2 text-mediumEmphasis px-[25px] min-[1024px]:px-[36px]"
        tBodyClassName="scroll-style  mt-6 overflow-y-scroll h-[320px] px-[25px] min-[1024px]:px-[36px]"
        icon={<Image alt="convergence icon" src="/images/components/competition/icons/convergence.svg" width={20} height={20} />}
        title={<h4 className="pl-[7px] text-h4">Top Converger</h4>}
        isLoading={isCompetitionLeaderboardLoadingData}
        thirdRowTitle="Net Conv. Vol."
        thirdRowTips="Convergence trading volume minus divergence trading volume."
        thirdRowValueGenerator={(value: string) =>
          CustomValue({
            ethIcon: true,
            value: `${Number(localeConversion(formatBigInt(value), 2)) > 0 ? '+' : ''}${
              Math.abs(Number(localeConversion(formatBigInt(value), 2))) === 0.0 ? '0.00' : localeConversion(formatBigInt(value), 2)
            }`
          })
        }
        reward={
          <CustomReward
            prizeLeftText="Prize Pool for Top 10:"
            prizeRightText="1,000 USDT + 52,000 Tribe3 Pts"
            mainClassName="px-[25px] min-[1024px]:px-[36px]"
            mainStyle={{
              background:
                'linear-gradient(270deg, rgba(86, 220, 250, 0.1) 0%, rgba(86, 220, 250, 0.25) 51.04%, rgba(86, 220, 250, 0.1) 100%)'
            }}
          />
        }
        bottomShadowPosition="0"
      />
      <CustomTable
        data={thirdLeaderboardData}
        userData={tlCurrentUserData}
        selectedField="pnl"
        tableClassName="flex-1 pt-[39px] rounde-md border border-white border-opacity-20 rounded-md
                bg-[url('/images/components/competition/backgrounds/losers.svg')] bg-no-repeat bg-contain"
        titleClassName="flex justify-between mb-[18px] px-[25px] min-[1024px]:px-[36px]"
        tHeadClassName="flex text-b2 text-mediumEmphasis px-[25px] min-[1024px]:px-[36px]"
        tBodyClassName="scroll-style  mt-6 overflow-y-scroll h-[320px] px-[25px] min-[1024px]:px-[36px]"
        icon={<Image alt="losers icon" src="/images/components/competition/icons/losers.svg" width={22} height={22} />}
        title={<h4 className="pl-[7px] text-h4">Rekt</h4>}
        isLoading={isCompetitionLeaderboardLoadingData}
        thirdRowTitle="Realized P/L"
        thirdRowTips="Realized P/L is the sum of funding payment and P/L from price change of a position. 
        P/L from price change refers to the gain & loss from full close, partial close and liquidation of a position."
        thirdRowValueGenerator={(value: string) =>
          CustomValue({
            ethIcon: true,
            value: `${Number(localeConversion(formatBigInt(value), 2)) > 0 ? '+' : ''}${
              Math.abs(Number(localeConversion(formatBigInt(value), 2))) === 0.0 ? '0.00' : localeConversion(formatBigInt(value), 2)
            }`
          })
        }
        reward={
          <CustomReward
            prizeLeftText="Prize Pool for Top 5:"
            prizeRightText="60,000 Tribe3 Pts"
            mainClassName="px-[25px] min-[1024px]:px-[36px]"
            mainStyle={{
              background:
                'linear-gradient(270deg, rgba(250, 165, 86, 0.1) 0%, rgba(250, 165, 86, 0.25) 51.04%, rgba(250, 165, 86, 0.1) 100%)'
            }}
          />
        }
        bottomShadowPosition="0"
      />
    </div>
  );
};

export default Leaderboard;
