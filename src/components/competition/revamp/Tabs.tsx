/* eslint-disable max-len */
import { $activeTab } from '@/stores/competition';
import { useRouter } from 'next/router';
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';

function TabIcon(props: any) {
  // eslint-disable-next-line no-unused-vars
  const { active, idName, svgSource, label, onClick, itemIndex } = props;

  return (
    <div
      className={`item ${active ? 'active' : ''} relative
        flex cursor-pointer 
      `}
      onClick={onClick}>
      <div className="flex items-center space-x-[4px] pb-[8px] md:px-0">
        {svgSource ? (
          <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradient" gradientUnits="userSpaceOnUse" fy="90%">
                <stop offset="0" stopColor="#04aefc" />
                <stop offset="0.5" stopColor="#795af4" />
                <stop offset="1" stopColor="#f703d9" />
              </linearGradient>
              0x778d8a7333c4eba1d9e8e99223a06fbbc03c091f
              <mask id={idName} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                <path d={svgSource} fill="white" fillOpacity="0.87" />
              </mask>
            </defs>

            <g mask={`url(#${idName})`}>
              <rect x="0" y="0" width="16" height="16" fill="white" fillOpacity="0.87" />
              <rect id="tab-icon-transition" x="0" y="0" width="16" height="16" fill="url(#gradient)" />
            </g>
          </svg>
        ) : null}
        <span className="text-b1e">{label}</span>
      </div>
    </div>
  );
}

function Tabs() {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  const activeTab = useNanostore($activeTab);

  const handleClickTab = (e: React.MouseEvent<HTMLElement>, tab: number) => {
    // switch (tab) {
    //   case 0:
    //     router.push('/airdrop', undefined, { shallow: true });
    //     break;
    //   case 1:
    //     router.push('/airdrop/refer', undefined, { shallow: true });
    //     break;
    //   case 2:
    //     router.push('/airdrop/leaderboard', undefined, { shallow: true });
    //     break;
    //   case 3:
    //     router.push('/airdrop/rules', undefined, { shallow: true });
    //     break;
    //   default:
    //     break;
    // }
    $activeTab.set(tab);

    const competitionTab = document.querySelector('.competition_tabs');
    const scrollCenter = competitionTab ? competitionTab.scrollWidth / 2 : 0;
    const tabOffsetL = e.currentTarget.offsetLeft;
    competitionTab?.scrollTo({
      left: tabOffsetL >= scrollCenter ? tabOffsetL + scrollCenter : tabOffsetL - scrollCenter,
      behavior: 'smooth'
    });
  };

  const tabs = [
    {
      label: 'Top Volume',
      // svgSource:
      //   'M4.58974 9.71098H2.25641C1.56359 9.71098 1 10.2595 1 10.9338V14.7771C1 15.4515 1.56359 16 2.25641 16H4.58974V9.71098ZM9.07692 7.96404H6.92308C6.23026 7.96404 5.66667 8.51258 5.66667 9.1869V16H10.3333V9.1869C10.3333 8.51258 9.76974 7.96404 9.07692 7.96404ZM13.7436 11.4579H11.4103V16H13.7436C14.4364 16 15 15.4515 15 14.7771V12.6808C15 12.0065 14.4364 11.4579 13.7436 11.4579ZM11.1116 3.176C11.0484 2.98663 10.8797 2.84757 10.6772 2.81892L9.16092 2.6051L8.48318 1.26833C8.30226 0.910556 7.69846 0.910556 7.51754 1.26833L6.8398 2.6051L5.32349 2.81892C5.12103 2.84757 4.95231 2.98663 4.88913 3.176C4.82595 3.36537 4.87836 3.5736 5.02554 3.71336L6.12256 4.75384L5.86338 6.22268C5.82892 6.41973 5.91149 6.61889 6.07733 6.73558C6.24318 6.85368 6.46287 6.86835 6.64451 6.77541L8.00072 6.08152L9.3562 6.77541C9.43518 6.81594 9.52062 6.83551 9.60677 6.83551C9.71805 6.83551 9.82933 6.80197 9.92338 6.73558C10.0892 6.61889 10.1718 6.41973 10.1373 6.22268L9.87815 4.75384L10.9752 3.71336C11.1224 3.5736 11.1748 3.36537 11.1116 3.176Z',
      idName: 'topvol-iconmask'
    },
    {
      label: 'Top Gainer',
      // svgSource:
      //   'M4.58974 9.71098H2.25641C1.56359 9.71098 1 10.2595 1 10.9338V14.7771C1 15.4515 1.56359 16 2.25641 16H4.58974V9.71098ZM9.07692 7.96404H6.92308C6.23026 7.96404 5.66667 8.51258 5.66667 9.1869V16H10.3333V9.1869C10.3333 8.51258 9.76974 7.96404 9.07692 7.96404ZM13.7436 11.4579H11.4103V16H13.7436C14.4364 16 15 15.4515 15 14.7771V12.6808C15 12.0065 14.4364 11.4579 13.7436 11.4579ZM11.1116 3.176C11.0484 2.98663 10.8797 2.84757 10.6772 2.81892L9.16092 2.6051L8.48318 1.26833C8.30226 0.910556 7.69846 0.910556 7.51754 1.26833L6.8398 2.6051L5.32349 2.81892C5.12103 2.84757 4.95231 2.98663 4.88913 3.176C4.82595 3.36537 4.87836 3.5736 5.02554 3.71336L6.12256 4.75384L5.86338 6.22268C5.82892 6.41973 5.91149 6.61889 6.07733 6.73558C6.24318 6.85368 6.46287 6.86835 6.64451 6.77541L8.00072 6.08152L9.3562 6.77541C9.43518 6.81594 9.52062 6.83551 9.60677 6.83551C9.71805 6.83551 9.82933 6.80197 9.92338 6.73558C10.0892 6.61889 10.1718 6.41973 10.1373 6.22268L9.87815 4.75384L10.9752 3.71336C11.1224 3.5736 11.1748 3.36537 11.1116 3.176Z',
      idName: 'topgainer-iconmask'
    },
    {
      label: 'Top FP Receiver',
      // svgSource:
      //   'M4.58974 9.71098H2.25641C1.56359 9.71098 1 10.2595 1 10.9338V14.7771C1 15.4515 1.56359 16 2.25641 16H4.58974V9.71098ZM9.07692 7.96404H6.92308C6.23026 7.96404 5.66667 8.51258 5.66667 9.1869V16H10.3333V9.1869C10.3333 8.51258 9.76974 7.96404 9.07692 7.96404ZM13.7436 11.4579H11.4103V16H13.7436C14.4364 16 15 15.4515 15 14.7771V12.6808C15 12.0065 14.4364 11.4579 13.7436 11.4579ZM11.1116 3.176C11.0484 2.98663 10.8797 2.84757 10.6772 2.81892L9.16092 2.6051L8.48318 1.26833C8.30226 0.910556 7.69846 0.910556 7.51754 1.26833L6.8398 2.6051L5.32349 2.81892C5.12103 2.84757 4.95231 2.98663 4.88913 3.176C4.82595 3.36537 4.87836 3.5736 5.02554 3.71336L6.12256 4.75384L5.86338 6.22268C5.82892 6.41973 5.91149 6.61889 6.07733 6.73558C6.24318 6.85368 6.46287 6.86835 6.64451 6.77541L8.00072 6.08152L9.3562 6.77541C9.43518 6.81594 9.52062 6.83551 9.60677 6.83551C9.71805 6.83551 9.82933 6.80197 9.92338 6.73558C10.0892 6.61889 10.1718 6.41973 10.1373 6.22268L9.87815 4.75384L10.9752 3.71336C11.1224 3.5736 11.1748 3.36537 11.1116 3.176Z',
      idName: 'topfp-iconmask'
    },
    {
      label: 'Top Referrer',
      // svgSource:
      //   'M4.58974 9.71098H2.25641C1.56359 9.71098 1 10.2595 1 10.9338V14.7771C1 15.4515 1.56359 16 2.25641 16H4.58974V9.71098ZM9.07692 7.96404H6.92308C6.23026 7.96404 5.66667 8.51258 5.66667 9.1869V16H10.3333V9.1869C10.3333 8.51258 9.76974 7.96404 9.07692 7.96404ZM13.7436 11.4579H11.4103V16H13.7436C14.4364 16 15 15.4515 15 14.7771V12.6808C15 12.0065 14.4364 11.4579 13.7436 11.4579ZM11.1116 3.176C11.0484 2.98663 10.8797 2.84757 10.6772 2.81892L9.16092 2.6051L8.48318 1.26833C8.30226 0.910556 7.69846 0.910556 7.51754 1.26833L6.8398 2.6051L5.32349 2.81892C5.12103 2.84757 4.95231 2.98663 4.88913 3.176C4.82595 3.36537 4.87836 3.5736 5.02554 3.71336L6.12256 4.75384L5.86338 6.22268C5.82892 6.41973 5.91149 6.61889 6.07733 6.73558C6.24318 6.85368 6.46287 6.86835 6.64451 6.77541L8.00072 6.08152L9.3562 6.77541C9.43518 6.81594 9.52062 6.83551 9.60677 6.83551C9.71805 6.83551 9.82933 6.80197 9.92338 6.73558C10.0892 6.61889 10.1718 6.41973 10.1373 6.22268L9.87815 4.75384L10.9752 3.71336C11.1224 3.5736 11.1748 3.36537 11.1116 3.176Z',
      idName: 'topreferrer-iconmask'
    },
    {
      label: 'My Performance',
      svgSource:
        'M4.00033 1.33325C3.26699 1.33325 2.66699 1.93325 2.66699 2.66659V13.3333C2.66699 14.0666 3.26699 14.6666 4.00033 14.6666H7.68001C7.36668 14.2666 7.12663 13.8199 6.95996 13.3333H4.00033V2.66659H12.0003V6.68612L13.3337 6.95955V2.66659C13.3337 1.93325 12.7337 1.33325 12.0003 1.33325H4.00033ZM5.33366 4.66658V5.99992H10.667V4.66658H5.33366ZM5.33366 7.33325V8.66658H7.68001C8.08001 8.11992 8.59319 7.66658 9.18652 7.33325H5.33366ZM11.667 7.99992C10.801 7.99992 9.99607 8.3029 9.36751 8.81632C8.53039 9.48526 8.00033 10.5188 8.00033 11.6666C8.00033 11.8039 8.00847 11.9416 8.02507 12.0767C8.22982 13.9061 9.78609 15.3333 11.667 15.3333C12.4367 15.3333 13.1514 15.0931 13.7425 14.6848L15.029 15.9713L15.9717 15.0286L14.6852 13.7421C15.0935 13.151 15.3337 12.4363 15.3337 11.6666C15.3337 9.64782 13.6858 7.99992 11.667 7.99992ZM12.0003 9.3658C13.1386 9.52592 14.0003 10.4797 14.0003 11.6666C14.0003 12.9678 12.9682 13.9999 11.667 13.9999C10.4821 13.9999 9.52792 13.132 9.36491 11.9999H12.0003V9.3658ZM5.33366 9.99992V11.3333H6.68652C6.70652 10.8666 6.79996 10.4199 6.95996 9.99992H5.33366Z',
      idName: 'myperformance-iconmask'
    }
  ];

  return (
    <div className="">
      <div className="competition_tabs hidden justify-center space-x-9 overflow-auto px-[20px] md:flex md:px-0">
        {tabs.map(({ label, idName, svgSource }, i) => (
          <TabIcon
            key={idName}
            svgSource={svgSource}
            label={label}
            idName={idName}
            active={activeTab === i}
            itemIndex={i}
            onClick={(e: React.MouseEvent<HTMLElement>) => handleClickTab(e, i)}
          />
        ))}
      </div>
    </div>
  );
}

export default Tabs;
