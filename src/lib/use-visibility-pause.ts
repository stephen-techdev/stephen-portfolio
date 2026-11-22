import { useEffect } from 'react';

/**
 * Pauses CSS animations on the document body when the tab is hidden,
 * reducing CPU/GPU usage during background periods.
 */
export function useVisibilityPause() {
  useEffect(() => {
    const handleVisibility = () => {
      document.body.classList.toggle('tab-hidden', document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);
}
