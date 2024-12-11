import { z } from 'zod';

export const PayeeSchema = z.object({
  id: z.string().describe('The payee ID'),
  name: z.string().nullable().describe('The payee name'),
  confidence: z
    .number()
    .describe('confidence score 0.0 to 1.0, where 1.0 is exact match'),
});
export type Payee = z.infer<typeof PayeeSchema>;
