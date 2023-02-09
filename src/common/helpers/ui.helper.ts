import { format } from 'date-fns';
import { useLayoutEffect, useState, useEffect } from 'react';
import store from '../state/common/store';

export const getCurrentTime = (): string => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
};

export const convertDateToFrontendFormat = (date: Date | string | undefined): string => {
  return format(new Date(date || ''), 'dd/MM/yyyy');
};

export const convertDateToBackendFormat = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const useWindowSize = (): number => {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return width;
};

export const dispatch = (action: any): void => {
  store.dispatch(action);
};

export const getTwoColumnChartWidth = (windowWidth: number): number => {
  const sidebarWidth = 100;
  const containerPadding = 40;
  const cardPadding = 8;

  return windowWidth - sidebarWidth - containerPadding * 2 - cardPadding * 4;
};

export const getOneColumnChartWidth = (windowWidth: number): number => {
  const containerPadding = 40;
  const cardPadding = 8;

  return windowWidth - containerPadding * 2 - cardPadding * 2;
};

export const removedItemsFromArray = (previousArray: string[], currentArray: string[]): string[] => {
  const removedItems: string[] = [];

  previousArray.forEach(preObj => {
    const found = currentArray.find(newObj => JSON.stringify(newObj) == JSON.stringify(preObj));
    if (!found) {
      removedItems.push(preObj);
    }
  });

  return removedItems;
};

export const addedItemsToArray = (previousArray: string[], currentArray: string[]): string[] => {
  const addedItems: string[] = [];
  currentArray.forEach(newObj => {
    const found = previousArray.find(prevObj => JSON.stringify(prevObj) == JSON.stringify(newObj));
    if (!found) {
      addedItems.push(newObj);
    }
  });

  return addedItems;
};

export const getConfirmationToken = (): string => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const confirmationToken = urlParams.get('confirmationToken');
  return confirmationToken as string;
};

export const getResetPasswordToken = (): string => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const resetPasswordToken = urlParams.get('resetPasswordToken') || urlParams.get('reset_password_token');
  return resetPasswordToken as string;
};

export const useOutsideAlerter = (ref: any, closeOnClick: any): void => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: any): void => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeOnClick(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
