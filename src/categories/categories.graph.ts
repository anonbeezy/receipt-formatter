import { END, START, StateGraph } from '@langchain/langgraph';
import { CategoriesState } from './state';
import { TransformNode } from './nodes/transform';
import { FormatNode } from './nodes/format';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesGraph {
  constructor(
    private readonly transformNode: TransformNode,
    private readonly formatNode: FormatNode,
  ) {}
  compile() {
    return new StateGraph(CategoriesState)
      .addNode('transform', this.transformNode)
      .addNode('format', this.formatNode)
      .addEdge(START, 'transform')
      .addEdge('transform', 'format')
      .addEdge('format', END)
      .compile();
  }
}
