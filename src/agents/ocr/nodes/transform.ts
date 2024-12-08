import { OcrState } from '../state';
import { ChatOpenAI } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';

import { template } from '../template';

export class TransformNode extends ToolNode {
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }

  async run(state: typeof OcrState.State) {
    console.log('Executing transformNode');

    const result = await template.pipe(this.model).invoke({
      text: state.receipt,
    });

    return {
      rawTransaction: result.content,
    };
  }
}
