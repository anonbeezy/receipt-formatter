import { ReceiptProcessingState } from '../state';
import { ChatOpenAI, formatToOpenAIFunction } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
import { LineItemSchema, StoreSchema, TransactionSchema } from '../schemas';
import { Injectable, Logger } from '@nestjs/common';

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

@Injectable()
export class FormatNode extends ToolNode {
  private readonly logger = new Logger(FormatNode.name);
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }
  async run(state: typeof ReceiptProcessingState.State) {
    this.logger.log('Executing formatNode');
    // TODO: Refactor this into the transform node by including the receiptObjectFunction in the template
    // TODO: Refactor into ReceiptParserService
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
        extractedTransaction: receipt.transaction,
        extractedLineItems: receipt.lineItems,
        extractedStore: receipt.store,
      };
    } catch (_) {
      return {
        extractedTransaction: null,
        extractedLineItems: [],
        extractedStore: null,
      };
    }
  }
}
