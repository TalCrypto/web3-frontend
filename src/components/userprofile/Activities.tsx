import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userHistories } from '@/stores/userprofile';
import { formatDateTime } from '@/utils/date';
import { TypeWithIconByAmm } from '@/components/common/TypeWithIcon';
import { getActionTypeFromApi, getTradingActionTypeFromSubgraph } from '@/utils/actionType';
import { formatBigInt, parseBigInt } from '@/utils/bigInt';
import { ExplorerButton } from '@/components/common/LabelsComponents';

const Activities: React.FC = () => {
  const userHistories = useNanostore($userHistories);
  console.log({ userHistories });

  return (
    <div>
      <table className="w-full items-center text-mediumEmphasis">
        <thead>
          <tr className="text-left text-b2">
            {/* desktop cols */}
            <th className="hidden py-4 font-normal md:table-cell">Date</th>
            <th className="hidden py-4 font-normal md:table-cell">Collection</th>
            <th className="hidden py-4 font-normal md:table-cell">Action</th>
            <th className="hidden py-4 font-normal md:table-cell">Type</th>
            <th className="hidden py-4 font-normal md:table-cell">Notional Size</th>
            <th className="hidden py-4 font-normal md:table-cell">Execution Price</th>
            <th className="hidden py-4 font-normal md:table-cell">Leverage</th>
            <th className="hidden py-4 font-normal md:table-cell"> </th>
            {/* mobile cols */}
            <th className="table-cell py-4 font-normal md:hidden">Action / Type</th>
            <th className="table-cell py-4 text-right font-normal md:hidden">Execution Price / Size</th>
          </tr>
        </thead>
        <tbody className="text-b1">
          {userHistories.map(d => {
            const tradingType = getTradingActionTypeFromSubgraph(d);
            const isOpen = tradingType === 'Open' || tradingType === 'Add';
            const showLeverageValue = !isOpen ? '-' : `${(formatBigInt(d.positionNotional) / formatBigInt(d.amount)).toFixed(2)}X`;
            return (
              <tr>
                {/* desktop cols */}
                <td className="hidden py-[10px] md:table-cell">
                  <div className="flex space-x-2">
                    <div className="w-[3px] rounded bg-[#2574FB]" />
                    <p>{formatDateTime(d.timestamp, 'MM/DD/YYYY HH:mm')}</p>
                  </div>
                </td>
                <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                  <div className="flex space-x-2">
                    <TypeWithIconByAmm imageWidth={20} imageHeight={20} amm={d.amm} showCollectionName />

                    {/* <Image src="/images/collections/small/azuki.svg" alt="" width={20} height={20} />
                  <p>{d.collection}</p> */}
                  </div>
                </td>
                <td className="hidden py-[10px] text-highEmphasis md:table-cell">{tradingType}</td>
                <td className="hidden py-[10px] md:table-cell">
                  <p className={d.type.toUpperCase() === 'LONG' ? 'text-marketGreen' : 'text-marketRed'}>{d.type.toUpperCase()}</p>
                </td>
                <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                  <div className="flex space-x-2">
                    <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                    <p>{formatBigInt(d.positionNotional).toFixed(4)}</p>
                  </div>
                </td>
                <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                  <div className="flex space-x-2">
                    <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                    <p>{d.entryPrice.toFixed(2)}</p>
                  </div>
                </td>
                <td className="hidden py-[10px] text-highEmphasis md:table-cell">{showLeverageValue}</td>
                <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                  <ExplorerButton width={20} height={20} txHash={d.txHash} />
                </td>
                {/* mobile cols */}
                <td className="table-cell md:hidden">
                  <div className="flex space-x-2 py-[12px]">
                    <div className="w-[3px] rounded bg-[#2574FB]" />
                    <div className="flex flex-col space-y-2">
                      <p>{formatDateTime(d.timestamp, 'MM/DD/YYYY HH:mm')}</p>
                      <p className="text-highEmphasis">{tradingType}</p>
                      <div className="flex space-x-1">
                        <TypeWithIconByAmm imageWidth={20} imageHeight={20} amm={d.amm} showCollectionName />
                        <p className={d.type.toUpperCase() === 'LONG' ? 'text-marketGreen' : 'text-marketRed'}>{d.type.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="table-cell md:hidden">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
