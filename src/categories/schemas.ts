import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().nullable().describe('The category ID'),
  name: z.string().nullable().describe('The category name'),
  confidence: z.number().describe('Confidence score from 0.0 to 1.0'),
  thinking: z.string().describe('The thinking process of the LLM'),
  reason: z
    .string()
    .describe('The specific reason why this payee was selected as a match'),
});
export type Category = z.infer<typeof CategorySchema>;
