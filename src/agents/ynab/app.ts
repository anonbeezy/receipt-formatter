import { END, START, StateGraph } from '@langchain/langgraph';
import { YnabState } from './state';
import { FormatNode } from './nodes/format';
import { ApiNode } from './nodes/api';

import { ChatOpenAI } from '@langchain/openai';
import { YnabService } from '../../services/ynab.service';

export class YnabApp {
  constructor(
    private readonly apiNode: ApiNode,
    private readonly formatNode: FormatNode,
  ) {}
  initialize() {
    return new StateGraph(YnabState)
      .addNode('api', this.apiNode)
      .addNode('format', this.formatNode)
      .addEdge(START, 'api')
      .addEdge('api', 'format')
      .addEdge('format', END)
      .compile();
  }
}

export const createApp = (model: ChatOpenAI) => {
  const ynabService = new YnabService(process.env.YNAB_PERSONAL_TOKEN!, {
    budgetId: process.env.BUDGET_ID!,
    accountId: process.env.ACCOUNT_ID!,
  });
  const apiNode = new ApiNode(ynabService);
  const formatNode = new FormatNode(model);

  return new YnabApp(apiNode, formatNode).initialize();
};
