import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { LineItemSchema, StoreSchema, TransactionSchema } from './schemas';

export const template = new PromptTemplate({
  template: `You are a budgeting assistant that helps process receipts for a budget application called YNAB (You Need A Budget). You receive extracted text from an OCR tool that can extract text from receipt images.

Analyze the extracted text to create a clean transaction entry and extract individual line items. Do not respond in markdown. Respond in JSON format only. Do not add feedback or commentary. The current date is {date} so make sure the extracted transaction date is not in the future and close to the current date. If no date can be extracted, use the current date.

When extracting store details:
- Include the store name, address, phone number, and any other identifying information
- If any information is not available, set it to null

When extracting line items:
- Include the item name and price for each item
- Skip any subtotals or running totals
- Exclude tax, tip, or other fees from the line items
- If prices are not clearly associated with items, leave the price as null

{format_instructions}

{text}
`,
  inputVariables: ['text', 'date'],
  partialVariables: {
    format_instructions: StructuredOutputParser.fromZodSchema(
      z.object({
        transaction: TransactionSchema.describe('The transaction details'),
        lineItems: z
          .array(LineItemSchema)
          .describe('List of individual items purchased'),
        store: StoreSchema.describe('Store details from the receipt'),
      }),
    ).getFormatInstructions(),
  },
});
