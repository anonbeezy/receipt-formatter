import { END, START, StateGraph } from '@langchain/langgraph';
import { CategoriesState } from './state';
import { TransformNode } from './nodes/transform';
import { FormatNode } from './nodes/format';

import { ChatOpenAI } from '@langchain/openai';
import { CategoriesService } from './categories.service';

export class CategoriesApp {
  constructor(
    private readonly transformNode: TransformNode,
    private readonly formatNode: FormatNode,
  ) {}
  initialize() {
    return new StateGraph(CategoriesState)
      .addNode('transform', this.transformNode)
      .addNode('format', this.formatNode)
      .addEdge(START, 'transform')
      .addEdge('transform', 'format')
      .addEdge('format', END)
      .compile();
  }
}

export const createApp = (model: ChatOpenAI) => {
  const categoriesService = new CategoriesService();
  const transformNode = new TransformNode(
    model,
    categoriesService.getCsvString(),
  );
  const formatNode = new FormatNode(model);

  return new CategoriesApp(transformNode, formatNode).initialize();
};
