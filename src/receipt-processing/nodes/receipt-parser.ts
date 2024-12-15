import { ReceiptProcessingState } from '../state';
import { ChatOpenAI } from '@langchain/openai';
import { template } from '../template';
import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { TransactionSchema, LineItemSchema, StoreSchema } from '../schemas';
import { Runnable } from '@langchain/core/runnables';

type Input = typeof ReceiptProcessingState.State;
type Output = typeof ReceiptProcessingState.Update;

const createReceiptObjectTool = tool(async (data) => data, {
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
export class ReceiptParserNode extends Runnable<Input, Output> {
  lc_namespace = ['receiptProcessing', 'nodes'];
  private readonly logger = new Logger(ReceiptParserNode.name);
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }

  async invoke(input: Input): Promise<Output> {
    this.logger.log('Executing receiptParserNode');

    const modelWithTools = this.model.bindTools([createReceiptObjectTool]);

    const result = await template.pipe(modelWithTools).invoke({
      text: input.receipt,
      date: new Date().toISOString(),
    });

    console.log(result);

    const receipt = result.tool_calls?.[0]?.args ?? {
      id: null,
      name: null,
      confidence: 0,
      thinking: null,
      reason: null,
    };

    return {
      extractedTransaction: receipt.transaction,
      extractedLineItems: receipt.lineItems,
      extractedStore: receipt.store,
    };
  }
}
