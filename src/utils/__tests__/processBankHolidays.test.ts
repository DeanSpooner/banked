import { ZodError } from 'zod';
import {
  filterHolidaysOverSixMonthsAway,
  mergeUkBankHolidays,
  removeDuplicateHolidays,
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
});
