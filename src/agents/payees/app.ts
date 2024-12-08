import { END, START, StateGraph } from '@langchain/langgraph';
import { PayeesState } from './state';
import { TransformNode } from './nodes/transform';
import { FormatNode } from './nodes/format';

import { ChatOpenAI } from '@langchain/openai';
import { PayeesService } from './payees.service';
import { YnabService } from '../../services/ynab.service';
export class PayeesApp {
  constructor(
    private readonly transformNode: TransformNode,
    private readonly formatNode: FormatNode,
  ) {}
  initialize() {
    return new StateGraph(PayeesState)
      .addNode('transform', this.transformNode)
      .addNode('format', this.formatNode)
      .addEdge(START, 'transform')
      .addEdge('transform', 'format')
      .addEdge('format', END)
      .compile();
  }
}

export const createApp = (model: ChatOpenAI) => {
  const ynabService = new YnabService(process.env.YNAB_PERSONAL_TOKEN!, {
    budgetId: process.env.BUDGET_ID!,
    accountId: process.env.ACCOUNT_ID!,
  });
  const payeesService = new PayeesService(ynabService);
  const transformNode = new TransformNode(model, payeesService.getCsvString());
  const formatNode = new FormatNode(model);

  return new PayeesApp(transformNode, formatNode).initialize();
};
