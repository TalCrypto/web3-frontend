import React, { useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $isMobileView } from '@/stores/modal';
import { $screenWidth } from '@/stores/window';

const LayoutUpdater: React.FC = () => {
  const isMobileView = useNanostore($isMobileView);

  useEffect(() => {
    const handleResize = () => {
      const elements = document.getElementsByClassName('mobile-view');
      if (!elements) return;
      const element = elements[0];
      if (!element) return;

      const styles = window.getComputedStyle(element);
      const isVisibleNow = styles.display !== 'none';

      if (isVisibleNow && !isMobileView) {
        $isMobileView.set(true);
      } else if (!isVisibleNow && isMobileView) {
        $isMobileView.set(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileView]);

  useEffect(() => {
    const handleResize = () => {
      $screenWidth.set(window.screen.width);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return null;
};

export default LayoutUpdater;
