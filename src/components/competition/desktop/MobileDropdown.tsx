import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@nanostores/react';
import { $activeDropdown } from '@/stores/competition';

const mobileDropdownOptions = [
  {
    id: 0,
    label: 'Top Gainers',
    icon: '/images/components/competition/icons/m-gainer.svg'
  },
  {
    id: 1,
    label: 'Top Gainers %',
    icon: '/images/components/competition/icons/m-gainer2.svg'
  },
  {
    id: 2,
    label: 'Convergence',
    icon: '/images/components/competition/icons/m-convergence.svg'
  },
  {
    id: 3,
    label: 'Top Losers',
    icon: '/images/components/competition/icons/m-loser.svg'
  }
];

const MobileDropdown = () => {
  const [isExpand, setIsExpand] = useState(false);
  const activeDropdown = useStore($activeDropdown);

  const activeItem = mobileDropdownOptions.find(i => i.id === activeDropdown);

  return (
    <div className="relative md:hidden">
      <div className="flex justify-between bg-[#202249] px-5 py-[12px] hover:bg-[#202249aa]" onClick={() => setIsExpand(!isExpand)}>
        <div className="flex space-x-[6px]">
          <Image alt="gainers" src={activeItem?.icon || '/images/components/competition/icons/m-gainer.svg'} width={16} height={16} />
          <p className="b1">{activeItem?.label}</p>
        </div>

        <Image alt="dropdown" src="/images/components/competition/icons/dropdown.svg" width={20} height={20} />
      </div>
      {/* list */}
      <div className={`${isExpand ? '' : 'hidden'} absolute left-0 right-0 top-[48px] z-10`}>
        {mobileDropdownOptions.map(item => (
          <div
            className="flex space-x-[6px] bg-[#202249] p-5 hover:bg-[#202249aa]"
            onClick={() => {
              setIsExpand(false);
              $activeDropdown.set(item.id);
            }}>
            <Image alt="gainers" src={item.icon} width={16} height={16} />
            <p className="b1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileDropdown;
