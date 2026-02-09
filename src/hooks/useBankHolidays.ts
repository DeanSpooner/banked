import { BANK_HOLIDAYS_API_URL } from '@/constants/constants';
import { useCallback, useEffect } from 'react';
import { useBankHolidaysContext } from '../contexts/BankHolidayContext';
import { processBankHolidays } from '../utils/processBankHolidays';

export const useBankHolidays = () => {
  const {
    bankHolidays,
    initialiseBankHolidays,
    originalBankHolidays,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useBankHolidaysContext();

  const fetchHolidays = useCallback(
    async (forceRefresh: boolean = false) => {
      // If we are not forcing a refresh and there are already entries, don't bother fetching:
      if (bankHolidays.length > 0 && !forceRefresh) {
        setIsLoading(false);
        return;
      }

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
    [bankHolidays, initialiseBankHolidays, setError, setIsLoading],
  );

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  return {
    bankHolidays,
    isLoading,
    error,
    originalBankHolidays,
    fetchHolidays,
  };
};
