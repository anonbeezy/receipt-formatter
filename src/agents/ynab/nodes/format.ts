import { YnabState } from '../state';
import { ChatOpenAI, formatToOpenAIFunction } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { YnabTransactionSchema } from '../schemas';

const ynabTransactionObjectFunction = formatToOpenAIFunction({
  name: 'createYnabTransactionObject',
  description: 'Create a new YNAB Transaction object',
  schema: YnabTransactionSchema,
});

export class FormatNode extends ToolNode {
  constructor(private readonly model: ChatOpenAI) {
    super([]);
  }
  async run(state: typeof YnabState.State) {
    console.log('Executing formatNode');
    const functionCallResult = await this.model.completionWithRetry({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Create a new YNAB Transaction object from the following objects: 

          Transaction: 
          ${JSON.stringify(state.transaction)}

          Category:
          ${JSON.stringify(state.category)}

          Payee:
          ${JSON.stringify(state.payee)}
          `,
        },
      ],
      functions: [ynabTransactionObjectFunction],
    });

    try {
      const functionCall =
        functionCallResult.choices[0].message.function_call ??
        functionCallResult.choices[0].message.tool_calls?.[0].function;

      console.log({
        role: 'user',
        content: `Create a new YNAB Transaction object from the following objects: 

          Transaction: 
          ${JSON.stringify(state.transaction)}

          Category:
          ${JSON.stringify(state.category)}

          Payee:
          ${JSON.stringify(state.payee)}
          `,
      });
      console.log(JSON.stringify(functionCallResult, null, 2));

      return { ynabTransaction: JSON.parse(functionCall?.arguments ?? '') };
    } catch (e) {
      return {
        ynabTransaction: null,
      };
    }
  }
}
