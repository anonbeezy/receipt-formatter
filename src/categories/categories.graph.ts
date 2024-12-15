import { END, START, StateGraph } from '@langchain/langgraph';
import { CategoriesState } from './state';
import { MatchCategoryNode } from './nodes/match-category';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesGraph {
  constructor(private readonly matchCategoryNode: MatchCategoryNode) {}
  compile() {
    return new StateGraph(CategoriesState)
      .addNode('matchCategory', this.matchCategoryNode)
      .addEdge(START, 'matchCategory')
      .addEdge('matchCategory', END)
      .compile();
  }
}
