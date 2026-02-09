import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
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

const STORAGE_KEY = 'bankHolidaysStorage';

export const BankHolidayProvider = ({ children }: { children: ReactNode }) => {
  const [bankHolidays, setBankHolidays] = useState<BankHolidayWithId[]>([]);
  const [originalBankHolidays, setOriginalBankHolidays] = useState<
    BankHolidayWithId[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const { current, original } = JSON.parse(saved);
          setBankHolidays(current);
          setOriginalBankHolidays(original);
        }
      } catch (err) {
        console.error('Failed to load bank holidays from storage.', err);
      } finally {
        setHasHydrated(true);
        setIsLoading(false);
      }
    };

    loadPersistedData();
  }, []);

  useEffect(() => {
    if (hasHydrated && bankHolidays.length > 0) {
      const dataToSave = JSON.stringify({
        current: bankHolidays,
        original: originalBankHolidays,
      });

      AsyncStorage.setItem(STORAGE_KEY, dataToSave).catch(err =>
        console.error('Failed to save bank holidays to storage.', err),
      );
    }
  }, [bankHolidays, originalBankHolidays, hasHydrated]);

  const initialiseBankHolidays = (fetchedBankHolidays: BankHolidayWithId[]) => {
    // Only update state if the current state is empty, otherwise ignore the API data completely:
    setBankHolidays(currentValue => {
      if (currentValue.length === 0) {
        setOriginalBankHolidays(fetchedBankHolidays);
        return fetchedBankHolidays;
      }
      return currentValue;
    });

    setIsLoading(false);
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
