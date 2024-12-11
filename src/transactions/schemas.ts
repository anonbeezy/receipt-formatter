import { z } from 'zod';

const TransactionSchema = z.object({
  date: z
    .string()
    .describe(
      'The transaction date in ISO format (e.g. 2016-12-01). Future dates (scheduled transactions) are not permitted.',
    )
    .optional(),

  amount: z
    .number()
    .describe(
      'The transaction amount in milliunits (value × 1000). For example: 10.50 becomes 10500, 7,010.44 becomes 7010440. Always multiply the currency amount by 1000 to get the milliunits value.',
    )
    .optional(),

  payeeId: z
    .string()
    .nullable()
    .describe('The payee ID for the transaction.')
    .optional(),

  payeeName: z
    .string()
    .nullable()
    .describe('The payee name for the transaction.')
    .optional(),

  categoryId: z
    .string()
    .nullable()
    .describe('The category ID for the transaction.')
    .optional(),

  memo: z
    .string()
    .nullable()
    .describe(
      'The transaction memo or note. Suggest a relevant memo based on the items purchased.',
    )
    .optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
