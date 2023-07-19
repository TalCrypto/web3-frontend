import Image from 'next/image';
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userHistories } from '@/stores/userprofile';
import { formatDateTime } from '@/utils/date';
import { TypeWithIconByAmm } from '@/components/common/TypeWithIcon';
import { getTradingActionTypeFromSubgraph } from '@/utils/actionType';
import { formatBigInt } from '@/utils/bigInt';
import { ExplorerButton } from '@/components/common/LabelsComponents';

const Activities: React.FC = () => {
  const userHistories = useNanostore($userHistories);
  console.log({ userHistories });

  return (
    <div>
      <div className="w-full items-center text-mediumEmphasis">
        <div>
          <div className="flex text-left text-b2">
            {/* desktop cols */}
            <div className="hidden flex-1 py-4 font-normal md:table-cell">Date</div>
            <div className="hidden flex-1 py-4 font-normal md:table-cell">Collection</div>
            <div className="hidden flex-1 py-4 font-normal md:table-cell">Action</div>
            <div className="hidden flex-1 py-4 font-normal md:table-cell">Type</div>
            <div className="hidden flex-1 py-4 font-normal md:table-cell">Notional Size</div>
            <div className="hidden flex-1 py-4 font-normal md:table-cell">Execution Price</div>
            <div className="hidden flex-1 py-4 font-normal md:table-cell">Leverage</div>
            <div className="hidden flex-1 py-4 font-normal md:table-cell"> </div>
            {/* mobile cols */}
            <div className="table-cell flex-1 py-4 font-normal md:hidden">Action / Type</div>
            <div className="table-cell flex-1 py-4 text-right font-normal md:hidden">Execution Price</div>
          </div>
        </div>
        <div className="scrollable max-h-[400px] overflow-auto text-b1">
          {userHistories.map(d => {
            const tradingType = getTradingActionTypeFromSubgraph(d);
            const isOpen = tradingType === 'Open' || tradingType === 'Add';
            const showLeverageValue = !isOpen ? '-' : `${(formatBigInt(d.positionNotional) / formatBigInt(d.amount)).toFixed(2)}X`;
            return (
              <div className="flex">
                {/* desktop cols */}
                <div className="hidden flex-1 py-[10px] md:table-cell">
                  <div className="flex space-x-2">
                    <div className="w-[3px] rounded bg-[#2574FB]" />
                    <p>{formatDateTime(d.timestamp, 'MM/DD/YYYY HH:mm')}</p>
                  </div>
                </div>
                <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">
                  <div className="flex space-x-2">
                    <TypeWithIconByAmm imageWidth={20} imageHeight={20} amm={d.amm} showCollectionName />

                    {/* <Image src="/images/collections/small/azuki.svg" alt="" width={20} height={20} />
                  <p>{d.collection}</p> */}
                  </div>
                </div>
                <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">{tradingType}</div>
                <div className="hidden flex-1 py-[10px] md:table-cell">
                  <p className={d.type.toUpperCase() === 'LONG' ? 'text-marketGreen' : 'text-marketRed'}>{d.type.toUpperCase()}</p>
                </div>
                <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">
                  <div className="flex space-x-2">
                    <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                    <p>{formatBigInt(d.positionNotional).toFixed(4)}</p>
                  </div>
                </div>
                <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">
                  <div className="flex space-x-2">
                    <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                    <p>{d.entryPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">{showLeverageValue}</div>
                <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">
                  <ExplorerButton width={20} height={20} txHash={d.txHash} />
                </div>
                {/* mobile cols */}
                <div className="table-cell flex-1 md:hidden">
                  <div className="flex space-x-2 py-[12px]">
                    <div className="w-[3px] rounded bg-[#2574FB]" />
                    <div className="flex flex-col space-y-2">
                      <p>{formatDateTime(d.timestamp, 'MM/DD/YYYY HH:mm')}</p>
                      <p className="text-highEmphasis">{tradingType}</p>
                      <div className="flex space-x-1">
                        <Image src="/images/collections/small/azuki.svg" alt="" width={20} height={20} />
                        <p className={d.type.toUpperCase() === 'LONG' ? 'text-marketGreen' : 'text-marketRed'}>{d.type.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-cell flex-1 md:hidden">
                  <div className="flex flex-col items-end space-y-2">
                    <ExplorerButton width={20} height={20} txHash={d.txHash} />
                    <div className="flex space-x-2">
                      <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                      <p>{formatBigInt(d.positionNotional).toFixed(4)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                      <p>{d.entryPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Activities;
