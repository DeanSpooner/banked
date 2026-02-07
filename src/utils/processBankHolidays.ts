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
