import React, { useState } from 'react';
import Image from 'next/image';
import MobileMenu from '@/components/layout/footer/mobile/menu';
import { $isShowMobileModal } from '@/stores/modal';

import { useRouter } from 'next/router';
import MobileTradeFooterInfo from '@/components/layout/footer/mobile/bar/Trade';
import MobileCommonFooterInfo from '@/components/layout/footer/mobile/bar/Common';

function MobileFooter() {
  const router = useRouter();
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);

  return (
    <>
      <div
        className="backface-visibility-hidden duration-400 fixed bottom-0
          left-0 z-10 box-border block h-[49px] w-full transform bg-secondaryBlue
          pr-5 text-white md:hidden">
        <div
          className="box-border flex h-full w-full
            content-center items-center justify-normal overflow-hidden">
          {router.asPath === '/trade' ? <MobileTradeFooterInfo /> : <MobileCommonFooterInfo />}

          <div className="relative h-full w-[50px]">
            <button
              className="absolute bottom-[5px] right-0"
              onClick={() => {
                setIsShowMobileMenu(true);
                $isShowMobileModal.set(true);
              }}>
              <Image src="/images/mobile/common/menu_icon.svg" alt="" width={40} height={40} />
            </button>
          </div>
        </div>
      </div>

      {isShowMobileMenu ? <MobileMenu setIsShowMobileMenu={setIsShowMobileMenu} /> : null}
    </>
  );
}

export default MobileFooter;
