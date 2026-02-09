export const dateToJapaneseDate = (date: string) => {
  const splitDate = date.split('-');

  if (splitDate.length !== 3) {
    console.warn('String is not in the correct yyyy-MM-dd format.');
    return date;
  }

  const [year, month, day] = splitDate;

  return `${year}年${month}月${day}日`;
};
