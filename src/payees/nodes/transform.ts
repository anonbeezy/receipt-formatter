import { ToolNode } from '@langchain/langgraph/prebuilt';

import { ChatOpenAI } from '@langchain/openai';
import { PayeesState } from '../state';
import { template } from '../template';
import { PayeesService } from '../payees.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransformNode extends ToolNode {
  private readonly logger = new Logger(TransformNode.name);
  constructor(
    private readonly model: ChatOpenAI,
    private readonly payeesService: PayeesService,
  ) {
    super([]);
  }

  async run(state: typeof PayeesState.State) {
    this.logger.log('Executing transformNode');

    const result = await template.pipe(this.model).invoke({
      csv: await this.payeesService.findAllAsCsv(),
      input: state.payeeName,
    });

    return {
      rawPayee: result.content,
    };
  }
}
