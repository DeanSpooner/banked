import {
  addMonths,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  startOfToday,
} from 'date-fns';
import {
  ApiResponseSchema,
  BankHoliday,
  BankHolidayWithId,
} from '../api/schemas';

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

/**
 * This function compares all the dates of the passed-in bank holidays, and only returns bank holidays that fall within the next six months.
 * @param holidays - an array of bank holidays.
 * @param includeToday - a boolean to determine whether the current date should be included as a valid bank holiday, or whether it should be counted as in
 * the past. Optional param, defaults to true.
 * @returns An array of all BankHolidays whose dates fall within the next six months.
 */
export const filterHolidaysOverSixMonthsAway = (
  holidays: BankHoliday[],
  includeToday: boolean = true,
): BankHoliday[] => {
  const dateToday = startOfToday();

  const dateSixMonthsFromNow = addMonths(dateToday, 6);

  const filteredHolidays = holidays.filter(holiday => {
    const parsedHolidayDate = parseISO(holiday.date);

    // Check if holiday is just today - we may or may not want to include it
    // (feels like we should include it, but I could maybe add a setting where the user can toggle this):
    const isHolidayToday = isEqual(parsedHolidayDate, dateToday);

    const isHolidayAfterToday = isAfter(parsedHolidayDate, dateToday);

    // We definitely need to remove all past events, but may also need to exclude today if includeToday is false, hence the ternary here:
    const isTodayOrFuture = includeToday
      ? isHolidayToday || isHolidayAfterToday
      : isHolidayAfterToday;

    const isWithinSixMonths = isBefore(parsedHolidayDate, dateSixMonthsFromNow);

    // We want to only return this holiday if its date is today or in the future, _and_ it's within six months - otherwise it should be excluded:
    return isTodayOrFuture && isWithinSixMonths;
  });

  return filteredHolidays;
};

/**
 * This is a simple function that sorts and returns an array of passed-in bank holidays, returning them in ascending order, i.e. from earliest to latest.
 * @param holidays - an array of bank holidays.
 * @returns An array of sorted bank holidays.
 */
export const sortHolidays = (holidays: BankHoliday[]) => {
  return holidays.sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * This is a simple function that assigns a ID each bank holiday in an array.
 * @param holidays - an array of bank holidays.
 * @returns An array of bank holidays with IDs.
 */
export const assignHolidayIds = (
  holidays: BankHoliday[],
): BankHolidayWithId[] => {
  return holidays.map(holiday => ({
    ...holiday,
    id: `${holiday.date}-${holiday.title.replaceAll(' ', '_')}`,
  }));
};

/**
 * This function runs all the above helper functions from start-to-finish, getting all the bank holiday data from the API, removing all duplicates,
 * filtering out bank holidays that are not within the next six months. It then sorts all remaining dates (as these are not necessarily sorted; Scottish
 * and Northern Irish bank holidays will be at the end of the array, and dates in regions may not always be sorted in the API response anyway), and finally
 * returns the first five results, which should be the next five bank holidays in the UK.
 * @param rawData - the data we are passing into the function, which should hopefully be valid BankHoliday data
 * from the GOV endpoint.
 * @returns An array of the next five unique bank holidays in the UK.
 */
export const processBankHolidays = (rawData: unknown): BankHolidayWithId[] => {
  const allBankHolidays = mergeUkBankHolidays(rawData);

  const allUniqueBankHolidays = removeDuplicateHolidays(allBankHolidays);

  const bankHolidaysWithinSixMonths = filterHolidaysOverSixMonthsAway(
    allUniqueBankHolidays,
  );

  const sortedHolidays = sortHolidays(bankHolidaysWithinSixMonths);

  const sortedHolidaysWithIds = assignHolidayIds(sortedHolidays);

  // Return the first five results, i.e. the current/next five unique bank holidays across the UK:
  return sortedHolidaysWithIds.slice(0, 5);
};
