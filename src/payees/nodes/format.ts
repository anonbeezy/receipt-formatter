import { PayeesState } from '../state';
import { ChatOpenAI, formatToOpenAIFunction } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { PayeeSchema } from '../schemas';
import { Injectable, Logger } from '@nestjs/common';

const payeeObjectFunction = formatToOpenAIFunction({
  name: 'createPayeeObject',
  description: 'Create a new Payee object',
  schema: PayeeSchema,
});

@Injectable()
export class FormatNode extends ToolNode {
  private readonly logger = new Logger(FormatNode.name);
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }
  async run(state: typeof PayeesState.State) {
    this.logger.log('Executing formatNode');
    const functionCallResult = await this.model.completionWithRetry({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Create a new Payee object from the following object: ${state.rawPayee}`,
        },
      ],
      functions: [payeeObjectFunction],
    });

    try {
      const functionCall =
        functionCallResult.choices[0].message.function_call ??
        functionCallResult.choices[0].message.tool_calls?.[0].function;

      return { payee: JSON.parse(functionCall?.arguments ?? '') };
    } catch (_) {
      return {
        payee: null,
      };
    }
  }
}
