import { ZodError } from 'zod';
import {
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
