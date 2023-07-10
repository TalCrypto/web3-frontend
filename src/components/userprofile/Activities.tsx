import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Activities: React.FC = () => {
  const tableData = [
    {
      date: '07/18/2022 10:55',
      collection: 'AZUKI',
      action: 'Full Close',
      type: 'LONG',
      notional: 1.0401,
      exePrice: 14.01,
      leverage: '-'
    },
    {
      date: '07/18/2022 10:55',
      collection: 'MAYC',
      action: 'Close & Open',
      type: 'LONG',
      notional: 1.0401,
      exePrice: 14.01,
      leverage: '3X'
    },
    {
      date: '07/18/2022 10:55',
      collection: 'AZUKI',
      action: 'Full Close',
      type: 'SHORT',
      notional: 1.0401,
      exePrice: 14.01,
      leverage: '-'
    }
  ];

  return (
    <div>
      <table className="w-full items-center text-mediumEmphasis">
        <thead>
          <tr className="text-left text-b2">
            <th className="py-4 font-normal">Date</th>
            <th className="py-4 font-normal">Collection</th>
            <th className="py-4 font-normal">Action</th>
            <th className="py-4 font-normal">Type</th>
            <th className="py-4 font-normal">Notional Size</th>
            <th className="py-4 font-normal">Execution Price</th>
            <th className="py-4 font-normal">Leverage</th>
            <th className="py-4 font-normal"> </th>
          </tr>
        </thead>
        <tbody className="text-b1">
          {tableData.map(d => (
            <tr>
              <td className="py-[10px]">
                <div className="flex space-x-2">
                  <div className="w-[3px] rounded bg-[#2574FB]" />
                  <p>{d.date}</p>
                </div>
              </td>
              <td className="py-[10px] text-highEmphasis">
                <div className="flex space-x-2">
                  <Image src="/images/collections/small/azuki.svg" alt="" width={20} height={20} />
                  <p>{d.collection}</p>
                </div>
              </td>
              <td className="py-[10px] text-highEmphasis">{d.action}</td>
              <td className={d.type === 'LONG' ? 'text-marketGreen' : 'text-marketRed'}>{d.type}</td>
              <td className="py-[10px] text-highEmphasis">
                <div className="flex space-x-2">
                  <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                  <p>{d.notional}</p>
                </div>
              </td>
              <td className="py-[10px] text-highEmphasis">
                <div className="flex space-x-2">
                  <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                  <p>{d.exePrice}</p>
                </div>
              </td>
              <td className="py-[10px] text-highEmphasis">{d.leverage}</td>
              <td className="py-[10px] text-highEmphasis">
                <Link href="/">
                  <Image src="/images/components/userprofile/export.svg" alt="" width={20} height={20} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
