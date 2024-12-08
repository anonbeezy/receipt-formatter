import { ToolNode } from '@langchain/langgraph/prebuilt';

import { ChatOpenAI } from '@langchain/openai';
import { CategoriesState } from '../state';
import { template } from '../template';

export class TransformNode extends ToolNode {
  constructor(
    private readonly model: ChatOpenAI,
    private readonly csv: string,
  ) {
    super([]);
  }

  async run(state: typeof CategoriesState.State) {
    console.log('Executing transformNode');

    const result = await template.pipe(this.model).invoke({
      csv: this.csv,
      input: state.categoryName,
    });

    return {
      rawCategory: result.content,
    };
  }
}
