import { END, START, StateGraph } from '@langchain/langgraph';
import { PayeesState } from './state';
import { MatchPayeeNode } from './nodes/match-payee';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PayeesGraph {
  constructor(private readonly matchPayeeNode: MatchPayeeNode) {}
  compile() {
    return new StateGraph(PayeesState)
      .addNode('transform', this.matchPayeeNode)
      .addEdge(START, 'transform')
      .addEdge('transform', END)
      .compile();
  }
}
