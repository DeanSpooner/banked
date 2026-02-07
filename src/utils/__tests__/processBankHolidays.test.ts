import { mergeUkBankHolidays } from '../processBankHolidays';

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
});
