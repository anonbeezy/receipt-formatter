import { OcrState } from '../state';
import { ChatOpenAI, formatToOpenAIFunction } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
import { LineItemSchema, StoreSchema, TransactionSchema } from '../schemas';

const receiptObjectFunction = formatToOpenAIFunction({
  name: 'createReceiptObject',
  description: 'Create a new Receipt object',
  schema: z.object({
    transaction: TransactionSchema.describe('The transaction details'),
    lineItems: z
      .array(LineItemSchema)
      .describe('List of individual items purchased'),
    store: StoreSchema.describe('Store details from the receipt'),
  }),
});

export class FormatNode extends ToolNode {
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }
  async run(state: typeof OcrState.State) {
    console.log('Executing formatNode');
    // TODO: Refactor this into the transform node by including the receiptObjectFunction in the template
    const functionCallResult = await this.model.completionWithRetry({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Create a new Transaction object from the following receipt: ${state.rawTransaction}`,
        },
      ],
      functions: [receiptObjectFunction],
    });

    try {
      const functionCall =
        functionCallResult.choices[0].message.function_call ??
        functionCallResult.choices[0].message.tool_calls?.[0].function;

      const receipt = JSON.parse(functionCall?.arguments ?? '');
      return {
        transaction: receipt.transaction,
        lineItems: receipt.lineItems,
        store: receipt.store,
      };
    } catch (e) {
      return {
        transaction: null,
        lineItems: [],
        store: null,
      };
    }
  }
}
