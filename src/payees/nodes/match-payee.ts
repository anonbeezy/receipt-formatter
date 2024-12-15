import { ChatOpenAI } from '@langchain/openai';
import { PayeesState } from '../state';
import { template } from '../template';
import { PayeesService } from '../payees.service';
import { Injectable, Logger } from '@nestjs/common';
import { Runnable } from '@langchain/core/runnables';
import { tool } from '@langchain/core/tools';
import { Payee, PayeeSchema } from '../schemas';

type Input = typeof PayeesState.State;
type Output = typeof PayeesState.Update;

const payeeObjectTool = tool(async (data) => data, {
  name: 'createPayeeObject',
  description: 'Create a new Payee object',
  schema: PayeeSchema,
});

@Injectable()
export class MatchPayeeNode extends Runnable<Input, Output> {
  lc_namespace = ['payees', 'nodes'];
  private readonly logger = new Logger(MatchPayeeNode.name);
  constructor(
    private readonly model: ChatOpenAI,
    private readonly payeesService: PayeesService,
  ) {
    super();
  }

  async invoke(input: Input): Promise<Output> {
    this.logger.log('Executing matchPayeeNode');

    const modelWithTools = this.model.bindTools([payeeObjectTool]);

    const result = await template.pipe(modelWithTools).invoke({
      input: input.payeeName,
      csv: await this.payeesService.findAllAsCsv(),
    });
    const payeeObject =
      result.tool_calls?.[0]?.args ??
      ({
        id: null,
        name: null,
        confidence: 0,
        thinking: null,
        reason: null,
      } as Payee);

    return {
      payee: payeeObject,
    };
  }
}
