/* eslint-disable max-len */
import { $activeTab } from '@/stores/userprofile';
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
      <div className="flex items-center space-x-[4px] pb-[8px]">
        <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" gradientUnits="userSpaceOnUse" fy="90%">
              <stop offset="0" stopColor="#04aefc" />
              <stop offset="0.5" stopColor="#795af4" />
              <stop offset="1" stopColor="#f703d9" />
            </linearGradient>
            <mask id={idName} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
              <path d={svgSource} fill="white" fillOpacity="0.87" />
            </mask>
          </defs>

          <g mask={`url(#${idName})`} className="active_mask">
            <rect x="0" y="0" width="16" height="16" fill="white" fillOpacity="0.87" />
            <rect id="tab-icon-transition" x="0" y="0" width="16" height="16" fill="url(#gradient)" />
          </g>

          <g mask={`url(#${idName})`} className="normal_mask">
            <rect x="0" y="0" width="16" height="16" fill="white" fillOpacity="0.87" />
            <rect id="tab-icon-transition" x="0" y="0" width="16" height="16" fill="white" />
          </g>
        </svg>
        <span className="">{label}</span>
      </div>
      <div className="after absolute bottom-0 left-0 mt-2 h-[3px] w-full rounded-[3px]" />
    </div>
  );
}

function TabItems() {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  const activeTab = useNanostore($activeTab);

  const handleClickTab = (tab: number) => {
    // todo: wip

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
  };

  return (
    <div className="userprofile_tabs flex space-x-9">
      <TabIcon
        svgSource="M7.3335 1.36719C3.96483 1.70185 1.3335 4.54333 1.3335 8C1.3335 11.4567 3.96483 14.2981 7.3335 14.6328V1.36719ZM8.66683 1.36719V7.33333H14.633C14.3196 4.184 11.8162 1.68052 8.66683 1.36719ZM8.66683 8.66667V14.6328C11.8162 14.3201 14.3196 11.8167 14.633 8.66667H8.66683Z"
        label="Portfolio"
        idName="portfolio-icon-mask"
        active={activeTab === 0}
        itemIndex={0}
        onClick={() => handleClickTab(0)}
      />
      <TabIcon
        svgSource="M2.66659 2V10H1.33325V12C1.33325 13.1027 2.23059 14 3.33325 14H8.66659V13.3333V12.6667L9.99992 11.3333L8.66659 10H3.99992V3.33333H12.6666V6H13.9999V2H2.66659ZM5.33325 4.66667V6H6.66659V4.66667H5.33325ZM7.99992 4.66667V6H11.3333V4.66667H7.99992ZM5.33325 7.33333V8.66667H6.66659V7.33333H5.33325ZM9.99992 7.33333V8.66667H10.6666V9.94271L12.0572 11.3333L10.6666 12.724V14H9.99992V15.3333H15.9999V14H15.3333V12.724L13.9426 11.3333L15.3333 9.94271V8.66667H15.9999V7.33333H9.99992ZM11.9999 8.66667H13.9999V9.39062L12.9999 10.3906L11.9999 9.39062V8.66667ZM12.9999 12.276L13.9999 13.276V14H11.9999V13.276L12.9999 12.276Z"
        label="Activities"
        idName="activities-icon-mask"
        active={activeTab === 1}
        itemIndex={1}
        onClick={() => handleClickTab(1)}
      />
      <TabIcon
        svgSource="M8 2C6.52933 2 5.33333 3.196 5.33333 4.66667C5.33333 6.13733 6.52933 7.33333 8 7.33333C9.47067 7.33333 10.6667 6.13733 10.6667 4.66667C10.6667 3.196 9.47067 2 8 2ZM12 8C10.7908 8 9.70489 8.54435 8.97005 9.39844C8.63147 9.35989 8.30307 9.33333 8 9.33333C5.906 9.33333 2 10.364 2 12.3333V13.3333C2 13.7013 2.29867 14 2.66667 14H8.54297C9.23709 15.1927 10.5269 16 12 16C14.2012 16 16 14.2012 16 12C16 9.79876 14.2012 8 12 8ZM12 9.33333C12.6692 9.33333 13.2704 9.58469 13.737 9.98698L12 11.724L11.6094 11.3333C11.3494 11.0733 10.9267 11.0733 10.6667 11.3333C10.4067 11.5933 10.4067 12.016 10.6667 12.276L11.5286 13.138C11.7886 13.3987 12.2114 13.3987 12.4714 13.138L14.5039 11.1055C14.6033 11.3859 14.6667 11.684 14.6667 12C14.6667 13.4807 13.4807 14.6667 12 14.6667C10.5193 14.6667 9.33333 13.4807 9.33333 12C9.33333 10.5193 10.5193 9.33333 12 9.33333Z"
        label="Social"
        idName="social-icon-mask"
        active={activeTab === 2}
        itemIndex={2}
        onClick={() => handleClickTab(2)}
      />
      <TabIcon
        svgSource="M4.00033 1.33325C3.26699 1.33325 2.66699 1.93325 2.66699 2.66659V13.3333C2.66699 14.0666 3.26699 14.6666 4.00033 14.6666H7.68001C7.36668 14.2666 7.12663 13.8199 6.95996 13.3333H4.00033V2.66659H12.0003V6.68612L13.3337 6.95955V2.66659C13.3337 1.93325 12.7337 1.33325 12.0003 1.33325H4.00033ZM5.33366 4.66658V5.99992H10.667V4.66658H5.33366ZM5.33366 7.33325V8.66658H7.68001C8.08001 8.11992 8.59319 7.66658 9.18652 7.33325H5.33366ZM11.667 7.99992C10.801 7.99992 9.99607 8.3029 9.36751 8.81632C8.53039 9.48526 8.00033 10.5188 8.00033 11.6666C8.00033 11.8039 8.00847 11.9416 8.02507 12.0767C8.22982 13.9061 9.78609 15.3333 11.667 15.3333C12.4367 15.3333 13.1514 15.0931 13.7425 14.6848L15.029 15.9713L15.9717 15.0286L14.6852 13.7421C15.0935 13.151 15.3337 12.4363 15.3337 11.6666C15.3337 9.64782 13.6858 7.99992 11.667 7.99992ZM12.0003 9.3658C13.1386 9.52592 14.0003 10.4797 14.0003 11.6666C14.0003 12.9678 12.9682 13.9999 11.667 13.9999C10.4821 13.9999 9.52792 13.132 9.36491 11.9999H12.0003V9.3658ZM5.33366 9.99992V11.3333H6.68652C6.70652 10.8666 6.79996 10.4199 6.95996 9.99992H5.33366Z"
        label="Analysis"
        idName="analysis-icon-mask"
        active={activeTab === 3}
        itemIndex={3}
        onClick={() => handleClickTab(3)}
      />
    </div>
  );
}

export default TabItems;
