import { CategoriesState } from '../state';
import { ChatOpenAI, formatToOpenAIFunction } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { CategorySchema } from '../schemas';
import { Injectable, Logger } from '@nestjs/common';

const categoryObjectFunction = formatToOpenAIFunction({
  name: 'createCategoryObject',
  description: 'Create a new Category object',
  schema: CategorySchema,
});

@Injectable()
export class FormatNode extends ToolNode {
  private readonly logger = new Logger(FormatNode.name);
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }
  async run(state: typeof CategoriesState.State) {
    this.logger.log(`Executing formatNode: ${state.rawCategory}`);
    const functionCallResult = await this.model.completionWithRetry({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Create a new Category object from the following object: ${state.rawCategory}`,
        },
      ],
      functions: [categoryObjectFunction],
    });

    try {
      const functionCall =
        functionCallResult.choices[0].message.function_call ??
        functionCallResult.choices[0].message.tool_calls?.[0].function;

      return { category: JSON.parse(functionCall?.arguments ?? '') };
    } catch (_) {
      return {
        category: null,
      };
    }
  }
}
