import { BANK_HOLIDAYS_API_URL } from '@/constants/constants';
import { useCallback, useEffect } from 'react';
import { useBankHolidaysContext } from '../contexts/BankHolidayContext';
import { mockData } from '../utils/mockData';
import { processBankHolidays } from '../utils/processBankHolidays';

const USE_MOCK = false;

export const useBankHolidays = () => {
  const {
    bankHolidays,
    initialiseBankHolidays,
    originalBankHolidays,
    isLoading,
    setIsLoading,
    error,
    setError,
    isConnected,
  } = useBankHolidaysContext();

  const fetchHolidays = useCallback(
    async (forceRefresh: boolean = false) => {
      // If offline, do not bother attempting to fetch, just return:
      if (isConnected === false) {
        setIsLoading(false);
        return;
      }

      // If we are not forcing a refresh and there are already five entries, don't bother fetching:
      if (bankHolidays.length >= 5 && !forceRefresh) {
        setIsLoading(false);
        return;
      }

      try {
        // Reset the loading and error states every time this fetch is called:
        setIsLoading(true);
        setError(null);

        let rawData;

        if (USE_MOCK) {
          await new Promise(resolve => setTimeout(resolve, 500));
          rawData = mockData;
        } else {
          const response = await fetch(BANK_HOLIDAYS_API_URL);
          if (!response.ok) throw new Error('API Failure');
          rawData = await response.json();
        }

        const processedData = processBankHolidays(rawData);
        initialiseBankHolidays(processedData, forceRefresh);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Sorry, an error was encountered fetching the bank holidays. Please try again later.',
        );
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [
      bankHolidays.length,
      initialiseBankHolidays,
      isConnected,
      setError,
      setIsLoading,
    ],
  );

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  useEffect(() => {
    if (isConnected === true && error) {
      setError(null);
    }
  }, [error, isConnected, setError]);

  return {
    bankHolidays,
    isLoading,
    error,
    originalBankHolidays,
    fetchHolidays,
    isConnected,
  };
};
