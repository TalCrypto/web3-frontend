/* eslint-disable max-len */
import { $asActiveTab } from '@/stores/airdrop';
import { useRouter } from 'next/router';
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';

function TabIcon(props: any) {
  const { active, idName, svgSource, label, onClick, itemIndex } = props;

  return (
    <div
      className={`item ${active ? 'active' : ''} relative
        flex cursor-pointer items-center pb-3
        ${itemIndex === 0 ? '' : 'ml-9'}
      `}
      onClick={onClick}>
      <div className="after absolute bottom-0 left-0 mt-2 h-[3px] w-full rounded-[3px]" />

      <div className="mr-[6px]">
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
      </div>
      <div className="text-[14px]">{label}</div>
    </div>
  );
}

function TabItems() {
  const router = useRouter();
  const activeTab = useNanostore($asActiveTab);

  const handleClickTab = (tab: number) => {
    switch (tab) {
      case 0:
        router.push('/airdrop', undefined, { shallow: true });
        break;
      case 1:
        router.push('/airdrop/refer', undefined, { shallow: true });
        break;
      case 2:
        router.push('/airdrop/leaderboard', undefined, { shallow: true });
        break;
      case 3:
        router.push('/airdrop/rules', undefined, { shallow: true });
        break;
      default:
        break;
    }
    $asActiveTab.set(tab);
  };

  return (
    <div className="airdrop_items flex justify-center">
      <TabIcon
        svgSource="M3.99984 1.83337C3.2665 1.83337 2.6665 2.43337 2.6665 3.16671V13.8334C2.6665 14.5667 3.2665 15.1667 3.99984 15.1667H7.67952C7.36619 14.7667 7.12614 14.32 6.95947 13.8334H3.99984V3.16671H11.9998V7.18624L13.3332 7.45968V3.16671C13.3332 2.43337 12.7332 1.83337 11.9998 1.83337H3.99984ZM5.33317 5.16671V6.50004H10.6665V5.16671H5.33317ZM5.33317 7.83337V9.16671H7.67952C8.07952 8.62004 8.5927 8.16671 9.18604 7.83337H5.33317ZM11.6665 8.50004C10.8005 8.50004 9.99558 8.80302 9.36702 9.31645C8.5299 9.98539 7.99984 11.0189 7.99984 12.1667C7.99984 12.304 8.00798 12.4417 8.02458 12.5769C8.22933 14.4062 9.7856 15.8334 11.6665 15.8334C12.4362 15.8334 13.1509 15.5932 13.742 15.1849L15.0285 16.4714L15.9712 15.5287L14.6847 14.2422C15.093 13.6511 15.3332 12.9364 15.3332 12.1667C15.3332 10.1479 13.6853 8.50004 11.6665 8.50004ZM11.9998 9.86593C13.1382 10.026 13.9998 10.9799 13.9998 12.1667C13.9998 13.4679 12.9677 14.5 11.6665 14.5C10.4816 14.5 9.52743 13.6321 9.36442 12.5H11.9998V9.86593ZM5.33317 10.5V11.8334H6.68604C6.70604 11.3667 6.79947 10.92 6.95947 10.5H5.33317Z"
        label="Overview"
        idName="overview-icon-mask"
        active={activeTab === 0}
        itemIndex={0}
        onClick={() => handleClickTab(0)}
      />
      <TabIcon
        svgSource="M3.48956 6.33405C4.92496 6.33405 6.08859 5.17042 6.08859 3.73502C6.08859 2.29961 4.92496 1.13599 3.48956 1.13599C2.05415 1.13599 0.890527 2.29961 0.890527 3.73502C0.890527 5.17042 2.05415 6.33405 3.48956 6.33405ZM3.48956 7.27156C2.57069 7.27156 1.73262 6.91922 1.10316 6.34266C0.424625 6.97966 0 7.88419 0 8.88613V9.35488H6.97916V8.88613C6.97916 7.88419 6.55456 6.97966 5.876 6.34263C5.24653 6.91919 4.40847 7.27156 3.48956 7.27156ZM11.3972 12.6674C12.4322 12.6674 13.3833 12.3015 14.1282 11.6925C15.2628 12.5316 16 13.8788 16 15.3952V15.8639H6.79443V15.3952C6.79443 13.8788 7.53162 12.5316 8.66625 11.6925C9.41118 12.3015 10.3622 12.6674 11.3972 12.6674ZM13.7877 10.7388C15.109 9.41741 15.109 7.27507 13.7877 5.95371C12.4663 4.63235 10.324 4.63235 9.00259 5.95371C7.68123 7.27507 7.68123 9.41741 9.00259 10.7388C10.3239 12.0601 12.4663 12.0601 13.7877 10.7388ZM3.97423 13.545L3.43381 12.9599L4.03436 12.3097L5.6 14.0048L4.03436 15.7L3.43381 15.0497L3.97423 14.4646H0V10.9H0.849308V13.545H3.97423Z"
        label="Referral"
        idName="referral-icon-mask"
        active={activeTab === 1}
        itemIndex={1}
        onClick={() => handleClickTab(1)}
      />
      <TabIcon
        svgSource="M4.58974 9.71098H2.25641C1.56359 9.71098 1 10.2595 1 10.9338V14.7771C1 15.4515 1.56359 16 2.25641 16H4.58974V9.71098ZM9.07692 7.96404H6.92308C6.23026 7.96404 5.66667 8.51258 5.66667 9.1869V16H10.3333V9.1869C10.3333 8.51258 9.76974 7.96404 9.07692 7.96404ZM13.7436 11.4579H11.4103V16H13.7436C14.4364 16 15 15.4515 15 14.7771V12.6808C15 12.0065 14.4364 11.4579 13.7436 11.4579ZM11.1116 3.176C11.0484 2.98663 10.8797 2.84757 10.6772 2.81892L9.16092 2.6051L8.48318 1.26833C8.30226 0.910556 7.69846 0.910556 7.51754 1.26833L6.8398 2.6051L5.32349 2.81892C5.12103 2.84757 4.95231 2.98663 4.88913 3.176C4.82595 3.36537 4.87836 3.5736 5.02554 3.71336L6.12256 4.75384L5.86338 6.22268C5.82892 6.41973 5.91149 6.61889 6.07733 6.73558C6.24318 6.85368 6.46287 6.86835 6.64451 6.77541L8.00072 6.08152L9.3562 6.77541C9.43518 6.81594 9.52062 6.83551 9.60677 6.83551C9.71805 6.83551 9.82933 6.80197 9.92338 6.73558C10.0892 6.61889 10.1718 6.41973 10.1373 6.22268L9.87815 4.75384L10.9752 3.71336C11.1224 3.5736 11.1748 3.36537 11.1116 3.176Z"
        label="Leaderboard"
        idName="leaderboard-icon-mask"
        active={activeTab === 2}
        itemIndex={2}
        onClick={() => handleClickTab(2)}
      />
      <TabIcon
        svgSource="M12.0002 10.5V4.5C12.0002 3.39533 11.1048 2.5 10.0002 2.5H3.3335C2.22883 2.5 1.3335 3.39533 1.3335 4.5V5.83333C1.3335 6.20133 1.63216 6.5 2.00016 6.5H3.3335V12.5C3.3335 13.6047 4.22883 14.5 5.3335 14.5H12.6668C13.7715 14.5 14.6668 13.6047 14.6668 12.5V11.1667C14.6668 10.7987 14.3682 10.5 14.0002 10.5H12.0002ZM10.0002 8.5C10.0002 8.868 9.7015 9.16667 9.3335 9.16667H6.00016C5.63216 9.16667 5.3335 8.868 5.3335 8.5C5.3335 8.132 5.63216 7.83333 6.00016 7.83333H9.3335C9.7015 7.83333 10.0002 8.132 10.0002 8.5ZM10.0002 11.1667C10.0002 11.5347 9.7015 11.8333 9.3335 11.8333H6.00016C5.63216 11.8333 5.3335 11.5347 5.3335 11.1667C5.3335 10.7987 5.63216 10.5 6.00016 10.5H9.3335C9.7015 10.5 10.0002 10.7987 10.0002 11.1667ZM2.66683 4.5C2.66683 4.132 2.96616 3.83333 3.3335 3.83333H8.11416C8.04083 4.042 8.00016 4.266 8.00016 4.5V5.16667H2.66683V4.5ZM13.3335 12.5C13.3335 12.868 13.0342 13.1667 12.6668 13.1667C12.2995 13.1667 12.0002 12.868 12.0002 12.5V11.8333H13.3335V12.5Z"
        label="Rules"
        idName="rules-icon-mask"
        active={activeTab === 3}
        itemIndex={3}
        onClick={() => handleClickTab(3)}
      />
    </div>
  );
}

export default TabItems;
