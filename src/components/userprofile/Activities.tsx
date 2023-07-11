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
            <th className="table-cell py-4 text-right font-normal md:hidden">Execution Price</th>
          </tr>
        </thead>
        <tbody className="text-b1">
          {tableData.map(d => (
            <tr>
              {/* desktop cols */}
              <td className="hidden py-[10px] md:table-cell">
                <div className="flex space-x-2">
                  <div className="w-[3px] rounded bg-[#2574FB]" />
                  <p>{d.date}</p>
                </div>
              </td>
              <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                <div className="flex space-x-2">
                  <Image src="/images/collections/small/azuki.svg" alt="" width={20} height={20} />
                  <p>{d.collection}</p>
                </div>
              </td>
              <td className="hidden py-[10px] text-highEmphasis md:table-cell">{d.action}</td>
              <td className="hidden py-[10px] md:table-cell">
                <p className={d.type === 'LONG' ? 'text-marketGreen' : 'text-marketRed'}>{d.type}</p>
              </td>
              <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                <div className="flex space-x-2">
                  <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                  <p>{d.notional}</p>
                </div>
              </td>
              <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                <div className="flex space-x-2">
                  <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                  <p>{d.exePrice}</p>
                </div>
              </td>
              <td className="hidden py-[10px] text-highEmphasis md:table-cell">{d.leverage}</td>
              <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                <Link href="/">
                  <Image src="/images/components/userprofile/export.svg" alt="" width={20} height={20} />
                </Link>
              </td>
              {/* mobile cols */}
              <td className="table-cell md:hidden">
                <div className="flex space-x-2 py-[12px]">
                  <div className="w-[3px] rounded bg-[#2574FB]" />
                  <div className="flex flex-col space-y-2">
                    <p>{d.date}</p>
                    <p className="text-highEmphasis">{d.action}</p>
                    <div className="flex space-x-1">
                      <Image src="/images/collections/small/azuki.svg" alt="" width={20} height={20} />
                      <p className={d.type === 'LONG' ? 'text-marketGreen' : 'text-marketRed'}>{d.type}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="table-cell md:hidden">
                <div className="flex flex-col items-end space-y-2">
                  <Link href="/">
                    <Image src="/images/components/userprofile/export.svg" alt="" width={20} height={20} />
                  </Link>
                  <div className="flex space-x-2">
                    <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                    <p>{d.notional}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={20} height={20} />
                    <p>{d.exePrice}</p>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
