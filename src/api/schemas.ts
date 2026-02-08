import { z } from 'zod';

export const BankHolidaySchema = z.object({
  title: z.string(),
  date: z.string(),
  notes: z.string().optional(),
  bunting: z.boolean().optional(),
});

export const ApiResponseSchema = z.record(
  z.string(),
  z.object({
    division: z.string(),
    events: z.array(BankHolidaySchema),
  }),
);

export type BankHoliday = z.infer<typeof BankHolidaySchema>;
export type BankHolidayWithId = BankHoliday & {
  id: string;
};
