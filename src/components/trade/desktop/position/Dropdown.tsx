import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { $isShowMobileModal } from '@/stores/modal';
import { $userPosHistoryTrigger } from '@/stores/user';

const Dropdown = (props: any) => {
  const { showDropdown, setShowDropdown, setShowHistoryModal, setShowFundingPaymentModal } = props;
  const router = useRouter();

  useEffect(() => {
    const handleBodyClick = (event: any) => {
      if (!event.target.closest('.open-dropdown') && !event.target.closest('.position-dropdown') && showDropdown) {
        setShowDropdown(false);
      }
    };
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, [showDropdown, setShowDropdown]);

  const onClickViewHistory = () => {
    setShowHistoryModal(true);
    $isShowMobileModal.set(true);
    $userPosHistoryTrigger.set(!$userPosHistoryTrigger.get());
  };

  const onClickViewPortfolio = () => {
    router.push('/portfolio');
  };

  const onClickFundingPayment = () => {
    setShowFundingPaymentModal(true);
    $isShowMobileModal.set(true);
  };

  return (
    <div
      className="absolute right-[35px] top-[50px] z-[1]
          flex flex-col rounded-[6px] bg-secondaryBlue text-[14px]
          text-highEmphasis shadow-[2px_2px_8px_rgba(0,0,0,.25)]
        "
      onClick={() => setShowDropdown(false)}>
      <div
        className="flex cursor-pointer px-3
          py-4 text-highEmphasis hover:bg-white/[.1]"
        onClick={onClickViewHistory}>
        <Image className="mr-[6px]" alt="" src="/images/components/trade/position/trade_history.svg" width={16} height={16} />
        <span>View History</span>
      </div>
      <div
        className="flex cursor-pointer px-3
          py-4 text-highEmphasis hover:bg-white/[.1]"
        onClick={onClickViewPortfolio}>
        <Image className="mr-[6px]" alt="" src="/images/components/trade/position/position.svg" width={16} height={16} />
        <span>View Portfolio</span>
      </div>
      <div
        className="flex cursor-pointer px-3
          py-4 text-highEmphasis hover:bg-white/[.1]"
        onClick={onClickFundingPayment}>
        <Image className="mr-[6px]" alt="" src="/images/components/trade/position/funding_payment.svg" width={16} height={16} />
        <span>View Funding Payment</span>
      </div>
    </div>
  );
};

export default Dropdown;
