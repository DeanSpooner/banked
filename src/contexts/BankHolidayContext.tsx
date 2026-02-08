import { createContext, ReactNode, useContext, useState } from 'react';
import { BankHolidayWithId } from '../api/schemas';
import { sortHolidays } from '../utils/processBankHolidays';

interface BankHolidayContextType {
  bankHolidays: BankHolidayWithId[];
  setBankHolidays: (bankHolidays: BankHolidayWithId[]) => void;
  originalBankHolidays: BankHolidayWithId[];
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  initialiseBankHolidays: (bankHolidays: BankHolidayWithId[]) => void;
  updateBankHoliday: (
    id: string,
    updatedBankHoliday: BankHolidayWithId,
  ) => void;
  resetBankHoliday: (id: string) => void;
}

const BankHolidayContext = createContext<BankHolidayContextType | undefined>(
  undefined,
);

export const BankHolidayProvider = ({ children }: { children: ReactNode }) => {
  const [bankHolidays, setBankHolidays] = useState<BankHolidayWithId[]>([]);
  const [originalBankHolidays, setOriginalBankHolidays] = useState<
    BankHolidayWithId[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initialiseBankHolidays = (fetchedBankHolidays: BankHolidayWithId[]) => {
    setBankHolidays(fetchedBankHolidays);
    setOriginalBankHolidays(fetchedBankHolidays);
  };

  const updateBankHoliday = (id: string, updatedHoliday: BankHolidayWithId) => {
    setBankHolidays(prev => {
      // Replace the bank holiday that matches the ID with this updatedHoliday:
      const newHolidays = prev.map(h => (h.id === id ? updatedHoliday : h));

      return sortHolidays(newHolidays);
    });
  };

  const resetBankHoliday = (id: string) => {
    setBankHolidays(prev => {
      // Find the specific original holiday that matches our ID:
      const original = originalBankHolidays.find(h => h.id === id);

      // If we cannot find it, just return current state:
      if (!original) {
        return prev;
      }

      // Replace the modified bank holiday with the original one:
      const resetList = prev.map(h => (h.id === id ? original : h));

      return sortHolidays(resetList);
    });
  };

  return (
    <BankHolidayContext.Provider
      value={{
        bankHolidays,
        setBankHolidays,
        originalBankHolidays,
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
