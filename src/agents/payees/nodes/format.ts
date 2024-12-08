import { PayeesState } from '../state';
import { ChatOpenAI, formatToOpenAIFunction } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { PayeeSchema } from '../schemas';

const payeeObjectFunction = formatToOpenAIFunction({
  name: 'createPayeeObject',
  description: 'Create a new Payee object',
  schema: PayeeSchema,
});

export class FormatNode extends ToolNode {
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }
  async run(state: typeof PayeesState.State) {
    console.log('Executing formatNode');
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
    } catch (e) {
      return {
        payee: null,
      };
    }
  }
}
