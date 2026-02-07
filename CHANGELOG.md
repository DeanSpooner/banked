This is a file containing the general process of me making the Banked app - this is likely going to follow my commits from this point:

1. Created RN/Expo app (decided to use Expo as RN themselves recommend this as a framework, plus it's what I'm used to in my current job with the apps I work with);
2. General tidy-up from what `create-expo-app` created, removed most of the template components, utils etc., except for a couple related to theming that I may likely use in the future. Added a bit more structure for how I envisage this repo building out, and added an About tab just so I have multiple tabs - will use this, Home (`index.tsx`) and possibly a Settings tab in the future;
3. Created Zod schemas for the API, and each bank holiday. Starting to create functions (TDD with Jest) to process this data so it will eventually be an array of the next five unique bank holidays across the entirety of the UK. Starting with `mergeUkBankHolidays` to just merge the regions' bank holidays into one large array of all bank holidays, including duplicates;
4. Added test for `mergeUkBankHolidays` for when data is actually invalid (would expect Zod to throw an error in this case);
5. Added and implemented Husky as a pre-commit hook to run all tests at each commit, before I start adding any more tests. Purposefully broke one of the above tests to check it worked, which it did;
6. Added `removeDuplicateHolidays` function and tests to remove all duplicate bank holidays from a BankHoliday array;
7. Added `filterHolidaysOverSixMonthsAway` function and tests to remove all bank holidays that do not fall within the next six months, using `date-fns` package I read about on StackOverflow;
