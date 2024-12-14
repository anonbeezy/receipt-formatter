import { ChatOpenAI } from '@langchain/openai';
import { PayeesState } from '../state';
import { template } from '../template';
import { PayeesService } from '../payees.service';
import { Injectable, Logger } from '@nestjs/common';
import { Runnable } from '@langchain/core/runnables';

type Input = typeof PayeesState.State;
type Output = typeof PayeesState.Update;

@Injectable()
export class TransformNode extends Runnable<Input, Output> {
  lc_namespace = ['payees', 'nodes'];
  private readonly logger = new Logger(TransformNode.name);
  constructor(
    private readonly model: ChatOpenAI,
    private readonly payeesService: PayeesService,
  ) {
    super();
  }

  async invoke(input: Input): Promise<Output> {
    this.logger.log('Executing transformNode');

    const result = await template.pipe(this.model).invoke({
      csv: await this.payeesService.findAllAsCsv(),
      input: input.payeeName,
    });

    return {
      rawPayee: result.content as string,
    };
  }
}
