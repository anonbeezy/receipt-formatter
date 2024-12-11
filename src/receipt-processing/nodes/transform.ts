import { ReceiptProcessingState } from '../state';
import { ChatOpenAI } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';

import { template } from '../template';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransformNode extends ToolNode {
  private readonly logger = new Logger(TransformNode.name);
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }

  async run(state: typeof ReceiptProcessingState.State) {
    this.logger.log('Executing transformNode');

    const result = await template.pipe(this.model).invoke({
      text: state.receipt,
      date: new Date().toISOString(),
    });

    return {
      rawTransaction: result.content,
    };
  }
}
