import { PromptTemplate } from '@langchain/core/prompts';

export const template = new PromptTemplate({
  template: `Process this receipt text into a structured format and use the createReceiptObject tool with the results.

Rules:
1. Date must not be future, default to {date} if unclear
2. All prices must be negative numbers
3. Skip subtotals/running totals
4. Exclude tax/tip/fees from line items
5. Use null for missing information
6. For store name, ONLY use the very first business name that appears at the very top of the receipt. Ignore any corporate/franchise names that appear later in the receipt.

Extract the following and pass to createReceiptObject:
- transaction: {{date, amount}}
- lineItems: array of {{name, price}}
- store: {{name, address, phone}}

Receipt text:
{text}
`,
  inputVariables: ['text', 'date'],
});
