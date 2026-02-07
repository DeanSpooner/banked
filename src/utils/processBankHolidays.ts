import { ApiResponseSchema, BankHoliday } from '../api/schemas';

/**
 * This function should merge the `england-and-wales`, `scotland` and `northern-ireland` regions into one array
 * of all bank holidays.
 * @param rawData - the data we are passing into the function, which should hopefully be valid BankHoliday data
 * from the GOV endpoint.
 * @returns An array of all BankHolidays - including duplicates at this point.
 */
export const mergeUkBankHolidays = (rawData: unknown): BankHoliday[] => {
  const validatedData = ApiResponseSchema.parse(rawData);

  return Object.values(validatedData).flatMap(region => region.events);
};

/**
 * This function removes all duplicate bank holidays in a BankHoliday array. To be a duplicate, it must have both the same title _and_ date.
 * @param holidays - the entire array of bank holidays the API gives us, including duplicates across all regions.
 * @returns An array of unique BankHolidays.
 */
export const removeDuplicateHolidays = (
  holidays: BankHoliday[],
): BankHoliday[] => {
  return holidays.filter(
    (holiday, index, arr) =>
      // findIndex should return the first matching index of the condition, so if two duplicate holidays exist, the second duplicate's index would not match with
      // what findIndex would find, and should therefore be filtered out:
      index ===
      arr.findIndex(h => h.date === holiday.date && h.title === holiday.title),
  );
};
