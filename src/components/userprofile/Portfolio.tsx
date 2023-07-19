import { getCollectionInformation } from '@/const/collectionList';
import { $userprofilePositionInfos } from '@/stores/userprofile';
import { useStore } from '@nanostores/react';
import Image from 'next/image';
import React from 'react';

const Portfolio: React.FC = () => {
  const userprofilePositionInfos: any = useStore($userprofilePositionInfos);
  const userprofilePositionInfosArrKey: any[] = Object.keys(userprofilePositionInfos);

  const renderValueWithStatement = (value: number, result1: string, result2: string, result3: string) => {
    if (value > 0) {
      return result1;
    }
    if (value < 0) {
      return result2;
    }
    return result3;
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      {/* card */}
      {userprofilePositionInfosArrKey.length > 0 &&
        userprofilePositionInfosArrKey?.map(amm => {
          const collectionInfo = getCollectionInformation(amm);
          const { collectionName, logo, displayCollectionPair } = collectionInfo;
          const positionInfo = userprofilePositionInfos[amm];
          const unrealizedPnl = Number(positionInfo.unrealizedPnl.toFixed(4));
          const notional = Number(positionInfo.currentNotional.toFixed(4));
          const leverage = Number(positionInfo.leverage.toFixed(2));
          const type = Number(positionInfo.size) > 0 ? 'LONG' : 'SHORT';

          if (userprofilePositionInfos[amm].currentNotional > 0) {
            return (
              <div
                key={amm}
                className={`rounded-[6px] border border-[rgba(113,170,255,0.25)] bg-gradient-to-b
                      from-[#37387280] to-[#0C0D1F80] p-[24px] text-b2 text-mediumEmphasis`}>
                <div className="flex">
                  <div className="flex-1">
                    <span
                      className={`mb-[6px] bg-gradient-to-r from-gradientBlue via-[#795AF4] to-gradientPink 
                        bg-clip-text text-h5 text-transparent`}>
                      {collectionName}
                    </span>
                    <p className="mb-[24px] text-b3 text-highEmphasis">{displayCollectionPair}</p>
                  </div>
                  <div>
                    <Image src={logo} alt="" width={40} height={40} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex">
                    <p className="flex-1">Unrealized P/L</p>
                    <div className="flex flex-1 space-x-[6px]">
                      <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={16} height={16} />
                      <p className={`${renderValueWithStatement(unrealizedPnl, 'text-marketGreen', 'text-marketRed', '')}`}>
                        {renderValueWithStatement(unrealizedPnl, '+', '', '') + unrealizedPnl}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <p className="flex-1">Notional</p>
                    <div className="flex flex-1 space-x-[6px]">
                      <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={16} height={16} />
                      <p className="text-highEmphasis">{notional}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <p className="flex-1">Leverage</p>
                    <p className="flex-1 text-highEmphasis">{leverage}X</p>
                  </div>
                  <div className="flex">
                    <p className="flex-1">Type</p>
                    <p className={`flex-1 ${type === 'LONG' ? 'text-marketGreen' : 'text-marketRed'}`}>{type}</p>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      {/* end of card */}
    </div>
  );
};

export default Portfolio;
