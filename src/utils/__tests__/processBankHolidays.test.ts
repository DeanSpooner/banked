import { ZodError } from 'zod';
import { mockData } from '../mockData';
import {
  assignHolidayIds,
  filterHolidaysOverSixMonthsAway,
  mergeUkBankHolidays,
  processBankHolidays,
  removeDuplicateHolidays,
  sortHolidays,
} from '../processBankHolidays';

describe('mergeUkBankHolidays', () => {
  it('should flatten events from multiple regions into one array', () => {
    const mockData = {
      'england-and-wales': {
        division: 'england-and-wales',
        events: [{ title: 'New Year', date: '2026-01-01' }],
      },
      scotland: {
        division: 'scotland',
        events: [{ title: 'Summer Bank Holiday', date: '2026-08-31' }],
      },
      'northern-ireland': {
        division: 'northern-ireland',
        events: [{ title: 'Summer Bank Holiday', date: '2026-08-31' }],
      },
    };

    const result = mergeUkBankHolidays(mockData);

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'New Year', date: '2026-01-01' }),
        expect.objectContaining({
          title: 'Summer Bank Holiday',
          date: '2026-08-31',
        }),
        expect.objectContaining({
          title: 'Summer Bank Holiday',
          date: '2026-08-31',
        }),
      ]),
    );
  });

  it('should throw a Zod validation error if the data structure is invalid', () => {
    const invalidMockData = {
      'england-and-wales': {
        division: 'england-and-wales',
      },
    };

    expect(() => mergeUkBankHolidays(invalidMockData)).toThrow(ZodError);
  });
});

describe('removeDuplicateHolidays', () => {
  const mockData = [
    { title: 'New Year', date: '2026-01-01' },
    { title: 'Summer Bank Holiday', date: '2026-08-31' },
    { title: 'Summer Bank Holiday', date: '2026-08-31' },
    { title: 'Christmas', date: '2026-12-25' },
  ];

  const result = removeDuplicateHolidays(mockData);

  expect(result).toHaveLength(3);
  expect(result[0].title).toBe('New Year');
  expect(result[0].date).toBe('2026-01-01');
  expect(result[1].title).toBe('Summer Bank Holiday');
  expect(result[1].date).toBe('2026-08-31');
  expect(result[2].title).toBe('Christmas');
  expect(result[2].date).toBe('2026-12-25');
});

describe('filterHolidaysOverSixMonthsAway', () => {
  // Need to set a fake timer so my tests don't fall over in the future!
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-02-07'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should keep holidays within the next 6 months and discard others', () => {
    const mockHolidays = [
      { title: 'New Year', date: '2026-01-01' },
      { title: 'Easter', date: '2026-04-05' },
      { title: 'School Holidays', date: '2026-07-20' },
      { title: 'Christmas', date: '2026-12-25' },
    ];

    const result = filterHolidaysOverSixMonthsAway(mockHolidays);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Easter');
    expect(result[0].date).toBe('2026-04-05');
    expect(result[1].title).toBe('School Holidays');
    expect(result[1].date).toBe('2026-07-20');
  });

  it('should respect the includeToday parameter', () => {
    const today = '2026-02-07';
    const mockData = [{ title: 'Today', date: today }];

    expect(filterHolidaysOverSixMonthsAway(mockData, false)).toHaveLength(0);
    expect(filterHolidaysOverSixMonthsAway(mockData, true)).toHaveLength(1);
    expect(filterHolidaysOverSixMonthsAway(mockData)).toHaveLength(1);
  });
});

describe('sortHolidays', () => {
  it('should sort the holidays in ascending order of their dates', () => {
    const mockUnsortedHolidays = [
      { title: 'Christmas', date: '2026-12-25' },
      { title: 'New Year', date: '2026-01-01' },
      { title: 'School Holidays', date: '2026-07-20' },
      { title: 'Easter', date: '2026-04-05' },
    ];

    const result = sortHolidays(mockUnsortedHolidays);

    expect(result).toHaveLength(4);
    expect(result[0].title).toBe('New Year');
    expect(result[0].date).toBe('2026-01-01');
    expect(result[1].title).toBe('Easter');
    expect(result[1].date).toBe('2026-04-05');
    expect(result[2].title).toBe('School Holidays');
    expect(result[2].date).toBe('2026-07-20');
    expect(result[3].title).toBe('Christmas');
    expect(result[3].date).toBe('2026-12-25');
  });
});

describe('processBankHolidays', () => {
  // Need to set a fake timer so my tests don't fall over in the future!
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-02-07'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return the next five unique bank holidays in the UK', () => {
    const result = processBankHolidays(mockData);

    expect(result).toHaveLength(5);
    expect(result[0].title).toBe("St Patrick's Day");
    expect(result[0].date).toBe('2026-03-17');
    expect(result[1].title).toBe('Good Friday');
    expect(result[1].date).toBe('2026-04-03');
    expect(result[2].title).toBe('Easter Monday');
    expect(result[2].date).toBe('2026-04-06');
    expect(result[3].title).toBe('Early May bank holiday');
    expect(result[3].date).toBe('2026-05-04');
    expect(result[4].title).toBe('Spring bank holiday');
    expect(result[4].date).toBe('2026-05-25');
  });

  it('should return the dates in ascending order by date', () => {
    const result = processBankHolidays(mockData);

    // Do not bother checking the last date, it obviously will not have a date after it to compare to:
    for (let i = 0; i < result.length - 1; i++) {
      // Each date should be 'less' than the date that comes after it in the array.
      // Seems that JS can compare ISO dates in 'YYYY-MM-DD' with comparison operators to easily perform this check:
      expect(result[i].date < result[i + 1].date).toBe(true);
    }
  });
});

describe('assignHolidayIds', () => {
  it('should assign an ID to each object based on its date and title', () => {
    const mockHolidays = [
      { title: 'New Year', date: '2026-01-01' },
      { title: 'Easter', date: '2026-04-05' },
      { title: 'School Holidays', date: '2026-07-20' },
      { title: 'Christmas', date: '2026-12-25' },
    ];

    const result = assignHolidayIds(mockHolidays);

    expect(result).toHaveLength(4);
    expect(result[0].id).toBe('2026-01-01-New_Year');
    expect(result[1].id).toBe('2026-04-05-Easter');
    expect(result[2].id).toBe('2026-07-20-School_Holidays');
    expect(result[3].id).toBe('2026-12-25-Christmas');
  });
});
