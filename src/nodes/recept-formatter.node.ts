import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { AgentState } from '../state';
import { runAgentNode } from '../helpers';

export const createReceiptFormatterNode = async (llmChain: Runnable) => {
  const receiptFormatterAgent = llmChain;
  return async (state: typeof AgentState.State, config?: RunnableConfig) => {
    return runAgentNode({
      state,
      agent: receiptFormatterAgent,
      name: 'ReceiptFormatter',
      config,
    });
  };
};
