import { dateToJapaneseDate } from '../dateToJapaneseDate';

describe('dateToJapaneseDate', () => {
  it('should convert yyyy-MM-dd to Japanese format', () => {
    expect(dateToJapaneseDate('2024-05-20')).toBe('2024年05月20日');
  });

  it('should return the original string and log a warning if format is invalid', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    expect(dateToJapaneseDate('2024/05/20')).toBe('2024/05/20');
    expect(spy).toHaveBeenCalledWith(
      'String is not in the correct yyyy-MM-dd format.',
    );

    spy.mockRestore();
  });

  it('should handle different forms of years and months if provided as strings', () => {
    expect(dateToJapaneseDate('24-5-1')).toBe('24年5月1日');
  });
});
