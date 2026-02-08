import { createContext, ReactNode, useContext, useState } from 'react';
import { BankHoliday } from '../api/schemas';

interface BankHolidayContextType {
  bankHolidays: BankHoliday[];
  setBankHolidays: (bankHolidays: BankHoliday[]) => void;
  originalBankHolidays: BankHoliday[];
  setOriginalBankHolidays: (bankHolidays: BankHoliday[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  initialiseBankHolidays: (bankHolidays: BankHoliday[]) => void;
  updateBankHoliday: (index: number, updatedBankHoliday: BankHoliday) => void;
  resetBankHoliday: (index: number) => void;
}

const BankHolidayContext = createContext<BankHolidayContextType | undefined>(
  undefined,
);

export const BankHolidayProvider = ({ children }: { children: ReactNode }) => {
  const [bankHolidays, setBankHolidays] = useState<BankHoliday[]>([]);
  const [originalBankHolidays, setOriginalBankHolidays] = useState<
    BankHoliday[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initialiseBankHolidays = (fetchedBankHolidays: BankHoliday[]) => {
    setBankHolidays(fetchedBankHolidays);
    setOriginalBankHolidays(fetchedBankHolidays);
  };

  const updateBankHoliday = (index: number, updatedHoliday: BankHoliday) => {
    setBankHolidays(prev => {
      const next = [...prev];
      next[index] = updatedHoliday;
      return next;
    });
  };

  const resetBankHoliday = (index: number) => {
    setBankHolidays(prev => {
      const next = [...prev];
      // Probably not needed, but just in case the user tries to reset a bank holiday before any data exists:
      if (originalBankHolidays[index]) {
        next[index] = originalBankHolidays[index];
      }
      return next;
    });
  };

  return (
    <BankHolidayContext.Provider
      value={{
        bankHolidays,
        setBankHolidays,
        originalBankHolidays,
        // TODO: Unsure if I need to actually pass setOriginalBankHolidays in, passing in for now but may not be needed later. Check later:
        setOriginalBankHolidays,
        isLoading,
        setIsLoading,
        error,
        setError,
        initialiseBankHolidays,
        updateBankHoliday,
        resetBankHoliday,
      }}
    >
      {children}
    </BankHolidayContext.Provider>
  );
};

export const useBankHolidaysContext = () => {
  const context = useContext(BankHolidayContext);
  if (!context) {
    throw new Error(
      'useBankHolidaysContext must be used within a BankHolidayProvider.',
    );
  }
  return context;
};
