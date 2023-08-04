import React, { FC, PropsWithChildren } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $isShowMobileDrawer } from '@/stores/competition';
import Image from 'next/image';

type MobileDrawerProps = PropsWithChildren & {
  title: string;
};

const MobileDrawer: FC<MobileDrawerProps> = ({ title, children }) => {
  const isShowMobileDrawer = useNanostore($isShowMobileDrawer);

  return (
    <div className="lg:hidden">
      {/* drawer popup */}
      <div
        className={`${
          isShowMobileDrawer ? 'translate-x-0' : 'translate-x-full'
        } fixed bottom-0 left-0 right-0 top-0 z-20 bg-darkBlue transition-transform duration-300`}>
        <div className="h-full overflow-auto pb-[50px]">{children}</div>

        <div className="absolute bottom-0 left-0 right-0 flex bg-secondaryBlue">
          <div className="px-5 py-4" onClick={() => $isShowMobileDrawer.set(false)}>
            <Image src="/images/common/caret-left.svg" width={14} height={14} alt="" />
          </div>
          <div className="flex-1 py-4 pr-5 text-center text-b1">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
