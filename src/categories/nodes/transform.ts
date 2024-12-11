import { ToolNode } from '@langchain/langgraph/prebuilt';

import { ChatOpenAI } from '@langchain/openai';
import { CategoriesState } from '../state';
import { template } from '../template';
import { Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from '../categories.service';

@Injectable()
export class TransformNode extends ToolNode {
  private readonly logger = new Logger(TransformNode.name);
  constructor(
    private readonly model: ChatOpenAI,
    private readonly categoriesService: CategoriesService,
  ) {
    super([]);
  }

  async run(state: typeof CategoriesState.State) {
    this.logger.log('Executing transformNode');

    this.logger.log(
      'Template',
      await template.invoke({
        csv: await this.categoriesService.findAllAsCsv(),
        input: state.categoryName,
      }),
    );

    const result = await template.pipe(this.model).invoke({
      csv: await this.categoriesService.findAllAsCsv(),
      input: state.categoryName,
    });

    this.logger.log(`Matched category: ${result.content}`);

    return {
      rawCategory: result.content,
    };
  }
}
