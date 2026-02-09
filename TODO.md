- Currently added local storage for bank holiday dates, but think it might need a little bit more to it to handle refreshing data etc.
  - Refreshing:
    1. What happens when the user logs on and a stored date is in the past? I think it should automatically delete old entries, refetch and do some kind of merge with the current holidays if there are any edited entries;
    2. Should pull-to-refresh delete edited entries, or merge with edited? If I changed `St Patrick's Day` to `St Dean's Day` and kept the date the same, should pull-to-refresh add `St Patrick's Day` back in or recognise I already changed that myself? I think it should already see it exists in the originalHolidays;
    3. If I get round to adding pull-to-refresh, I may want a modal to confirm the user wants to do this if they have any edited dates, as these will be deleted (unless I actually make it keep edited entries like I talk about in point 2);
    4. Need to also handle being offline, i.e. don't bother even trying to refresh even if the user asks if we can detect they're offline, just give some kind of messaging saying they need to connect.
- Any of the extras in the `README.md`, if I can fit any in in the time constraints of the task.
