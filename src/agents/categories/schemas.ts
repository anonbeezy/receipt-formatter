import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().describe('The category ID'),
  name: z.string().nullable().describe('The category name'),
  confidence: z
    .number()
    .describe('confidence score 0.0 to 1.0, where 1.0 is exact match'),
});
export type Category = z.infer<typeof CategorySchema>;
