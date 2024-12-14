import { z } from 'zod';

export const PayeeSchema = z.object({
  id: z.string().describe('The payee ID'),
  name: z.string().nullable().describe('The payee name'),
  confidence: z
    .number()
    .describe(
      'Confidence score from 0.0 to 1.0 where: ' +
        '1.0 = exact character-for-character name match, ' +
        '0.9 = exact match with different case/spacing/punctuation, ' +
        '0.7-0.8 = clear partial name match (e.g., "McDonald" vs "McDonalds"), ' +
        '0.5-0.6 = weak partial name match with strong contextual evidence, ' +
        '0.2-0.4 = matching only business category or type (e.g., both are stores), ' +
        '0.1 = extremely weak similarity, ' +
        '0.0 = no match at all. ' +
        'IMPORTANT: Matching only on business type (e.g., both being stores) should never score above 0.4',
    ),
  thinking: z.string().describe('The thinking process of the LLM'),
  reason: z
    .string()
    .describe('The specific reason why this payee was selected as a match'),
});
export type Payee = z.infer<typeof PayeeSchema>;
