import { useEffect, useRef } from 'react';

export const useDataRefresh = (refreshCallback, currentPage) => {
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    // Refresh data when navigating to dashboard from another page
    if (prevPageRef.current !== 'dashboard' && currentPage === 'dashboard') {
      refreshCallback();
    }
    prevPageRef.current = currentPage;
  }, [currentPage, refreshCallback]);

  // Also refresh on initial mount
  useEffect(() => {
    if (currentPage === 'dashboard') {
      refreshCallback();
    }
  }, []);
};