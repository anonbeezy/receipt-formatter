import { END, START, StateGraph } from '@langchain/langgraph';
import { TransactionState } from './state';
import { CreateTransactionNode } from './nodes/create-transaction';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsGraph {
  constructor(private readonly createNode: CreateTransactionNode) {}
  compile() {
    return new StateGraph(TransactionState)
      .addNode('create', this.createNode)
      .addEdge(START, 'create')
      .addEdge('create', END)
      .compile();
  }
}
