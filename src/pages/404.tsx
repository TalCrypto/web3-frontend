import React, { useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import PrimaryButton from '@/components/common/PrimaryButton';
import { $isNotFoundPage } from '@/stores/route';
import { useRouter } from 'next/router';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    $isNotFoundPage.set(true);
    return () => {
      $isNotFoundPage.set(false);
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Home"
        ogTitle="Start longing or shorting NFT collections with leverage."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <main>
        <div className="flex flex-col items-center pt-[64px]">
          <h3 className="mb-[36px] text-h3">Whoops, Page does not exist.</h3>
          <p className="mb-[64px] text-b1">You may have mistyped the address.</p>
          <PrimaryButton onClick={() => router.push('/')}>
            <div className="px-6 py-3 text-b1e">Go back to Home</div>
          </PrimaryButton>
        </div>
      </main>
    </>
  );
}
