import { END, START, StateGraph } from '@langchain/langgraph';
import { TransactionState } from './state';
import { CreateNode } from './nodes/create';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsGraph {
  constructor(private readonly createNode: CreateNode) {}
  compile() {
    return new StateGraph(TransactionState)
      .addNode('create', this.createNode)
      .addEdge(START, 'create')
      .addEdge('create', END)
      .compile();
  }
}
