import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { CreateReactAgentParams } from '@langchain/langgraph/dist/prebuilt/react_agent_executor';

export type BaseAgentParams = CreateReactAgentParams;
export abstract class BaseAgent {
  protected agent!: ReturnType<typeof createReactAgent>;
  constructor(private readonly llm: BaseAgentParams['llm']) {}

  protected initializeAgent(): void {
    this.agent = createReactAgent({
      llm: this.llm,
      tools: this.getTools(),
      messageModifier: this.getSystemMessage(),
    });
  }

  protected abstract getTools(): BaseAgentParams['tools'];

  protected abstract getSystemMessage(): BaseAgentParams['messageModifier'];

  protected abstract call(state: any, config: any): Promise<any>;

  getInputKey(): string {
    return `${this.constructor.name}Input`;
  }

  getOutputKey(): string {
    return `${this.constructor.name}Output`;
  }
}
