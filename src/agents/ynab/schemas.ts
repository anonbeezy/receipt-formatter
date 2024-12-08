import { z } from 'zod';

export const YnabTransactionSchema = z.object({
  account_id: z.string().describe('The account ID'),
  date: z
    .string()
    .describe(
      'The transaction date in ISO format (e.g. 2016-12-01). Future dates (scheduled transactions) are not permitted. Split transaction dates cannot be changed and if a different date is supplied it will be ignored.',
    ),
  amount: z
    .number()
    .describe(
      'The transaction amount in milliunits format. Split transaction amounts cannot be changed and if a different amount is supplied it will be ignored.',
    ),
  payee_id: z
    .string()
    .nullable()
    .describe(
      'The payee for the transaction. To create a transfer between two accounts, use the account transfer payee pointing to the target account. Account transfer payees are specified as `transfer_payee_id` on the account resource.',
    ),
  payee_name: z
    .string()
    .nullable()
    .describe(
      'The payee name. If a `payee_name` value is provided and `payee_id` has a null value, the `payee_name` value will be used to resolve the payee by either (1) a matching payee rename rule (only if `import_id` is also specified) or (2) a payee with the same name or (3) creation of a new payee.',
    ),
  category_id: z
    .string()
    .nullable()
    .describe(
      'The category for the transaction. To configure a split transaction, you can specify null for `category_id` and provide a `subtransactions` array as part of the transaction object. If an existing transaction is a split, the `category_id` cannot be changed. Credit Card Payment categories are not permitted and will be ignored if supplied.',
    ),
  memo: z.string().nullable().describe('The transaction memo'),
});
export type YnabTransaction = z.infer<typeof YnabTransactionSchema>;
