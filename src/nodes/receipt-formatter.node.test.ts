import { ChatOpenAI } from '@langchain/openai';
import 'dotenv/config';
import { z } from 'zod';

const input = `You are a budgeting assistant visualizing a transaction for a budget application called YNAB (You Need A Budget). The receipt text includes various purchase details from a supermarket. Extract the relevant information to create a clean transaction entry.

Receipt Text:
---
---

`;

(async () => {
  const transaction = z.object({
    date: z
      .string()
      .date()
      .describe(
        'The transaction date in ISO format (e.g. 2016-12-01). Future dates (scheduled transactions) are not permitted. If the year of date is not 2024 then set to null.'
      ),
    amount: z
      .number()
      .describe(
        'The total transaction amount in milliunits format. The currency amount multiplied by 1000'
      ),
    category: z
      .string()
      .describe(
        'The category for the transaction. Suggest a relevant category based on the items'
      ),
    payeeName: z.string().describe('The payee for the transaction.'),
    memo: z
      .string()
      .describe(
        'The memo for the transaction. Optionally include cashier name or additional notes'
      ),
  });

  const model = new ChatOpenAI({
    model: 'gpt-4',
    temperature: 0,
  });

  const modelWithStructure = model.withStructuredOutput(transaction, {
    name: 'transaction',
  });

  await modelWithStructure.invoke(input);
})();
