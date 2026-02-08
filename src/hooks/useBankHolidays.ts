import { BANK_HOLIDAYS_API_URL } from '@/constants/constants';
import { useCallback, useEffect } from 'react';
import { useBankHolidaysContext } from '../contexts/BankHolidayContext';
import { processBankHolidays } from '../utils/processBankHolidays';

export const useBankHolidays = () => {
  const {
    bankHolidays,
    initialiseBankHolidays,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useBankHolidaysContext();

  const fetchHolidays = useCallback(async () => {
    try {
      // Reset the loading and error states every time this fetch is called:
      setIsLoading(true);
      setError(null);

      const response = await fetch(BANK_HOLIDAYS_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      const rawData = await response.json();

      const processedData = processBankHolidays(rawData);
      initialiseBankHolidays(processedData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Sorry, an error was encountered fetching the bank holidays. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [initialiseBankHolidays, setError, setIsLoading]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  return {
    bankHolidays,
    isLoading,
    error,
  };
};
