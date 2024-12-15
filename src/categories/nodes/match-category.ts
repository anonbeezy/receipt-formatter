import { ChatOpenAI } from '@langchain/openai';
import { CategoriesState } from '../state';
import { template } from '../template';
import { Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from '../categories.service';
import { Category, CategorySchema } from '../schemas';
import { tool } from '@langchain/core/tools';
import { Runnable } from '@langchain/core/runnables';

type Input = typeof CategoriesState.State;
type Output = typeof CategoriesState.Update;

const categoryObjectTool = tool(async (data) => data, {
  name: 'createCategoryObject',
  description: 'Create a new Category object',
  schema: CategorySchema,
});

@Injectable()
export class MatchCategoryNode extends Runnable<Input, Output> {
  lc_namespace = ['categories', 'nodes'];
  private readonly logger = new Logger(MatchCategoryNode.name);
  constructor(
    private readonly model: ChatOpenAI,
    private readonly categoriesService: CategoriesService,
  ) {
    super([]);
  }

  async invoke(input: Input): Promise<Output> {
    this.logger.log('Executing matchCategoryNode');

    const modelWithTools = this.model.bindTools([categoryObjectTool]);

    const result = await template.pipe(modelWithTools).invoke({
      csv: await this.categoriesService.findAllAsCsv(),
      input: input.categoryName,
    });

    const categoryObject =
      result.tool_calls?.[0]?.args ??
      ({
        id: null,
        name: null,
        confidence: 0,
        thinking: null,
        reason: null,
      } as Category);

    return {
      category: categoryObject,
    };
  }
}
