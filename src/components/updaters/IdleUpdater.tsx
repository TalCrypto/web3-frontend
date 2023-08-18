import React, { useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $isIdle } from '@/stores/window';
import { useRouter } from 'next/router';

let reloadTimer: any;

const IdleUpdater: React.FC = () => {
  const isIdle = useNanostore($isIdle);
  const router = useRouter();

  function handleVisibilityChange() {
    if (document.hidden) {
      reloadTimer = setTimeout(() => {
        console.log('User became inactive');
        $isIdle.set(true);
      }, 30 * 60 * 1000); // 30 minutes refresh page after inactivity
    } else {
      console.log('User became active');
      // clear the timer if the user becomes active again and reload page if user isInactive
      // $isIdle.set(false);
      if ($isIdle.get()) {
        router.reload();
      }
      clearTimeout(reloadTimer);
    }
  }

  useEffect(() => {
    console.log({ isIdle });
  }, [isIdle]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(reloadTimer);
    };
  }, []);

  return null;
};

export default IdleUpdater;
