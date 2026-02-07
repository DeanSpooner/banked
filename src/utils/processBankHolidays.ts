import {
  addMonths,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  startOfToday,
} from 'date-fns';
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

/**
 * This function compares all the dates of the passed-in bank holidays, and only returns bank holidays that fall within the next six months.
 * @param holidays - an array of bank holidays.
 * @param includeToday - a boolean to determine whether the current date should be included as a valid bank holiday, or whether it should be counted as in
 * the past. Optional param, defaults to true.
 * @returns  An array of all BankHolidays whose dates fall within the next six months.
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
