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

  payeeName: z
    .string()
    .nullable()
    .describe('The payee name for the transaction.')
    .optional(),

  categoryName: z
    .string()
    .nullable()
    .describe(
      'The category name for the transaction. Suggest a relevant category based on the items purchased.',
    )
    .optional(),

  memo: z
    .string()
    .nullable()
    .describe(
      'The transaction memo or note. Suggest a relevant memo based on the items purchased.',
    )
    .optional(),
});

const LineItemSchema = z.object({
  name: z.string().describe('The name of the item'),
  quantity: z.number().describe('The quantity of the item'),
  price: z.number().describe('The price of the item'),
});

const StoreSchema = z.object({
  name: z.string().describe('The name of the store'),
  address: z.string().describe('The store address'),
  phone: z.string().describe('The store phone number'),
  website: z.string().describe('The store website'),
  taxId: z
    .string()
    .describe('The store tax ID or business number (aka EIN or TIN)'),
});

export { TransactionSchema, LineItemSchema, StoreSchema };
export type Transaction = z.infer<typeof TransactionSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
export type Store = z.infer<typeof StoreSchema>;
