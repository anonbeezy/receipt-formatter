import { END, START, StateGraph } from '@langchain/langgraph';
import { ReceiptProcessingState } from './state';
import { ExtractTextNode } from './nodes/extract';
import { ReceiptParserNode } from './nodes/receipt-parser';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceiptProcessingGraph {
  constructor(
    private readonly extractNode: ExtractTextNode,
    private readonly receiptParserNode: ReceiptParserNode,
  ) {}
  compile() {
    return new StateGraph(ReceiptProcessingState)
      .addNode('extractText', this.extractNode)
      .addNode('receiptParser', this.receiptParserNode)
      .addEdge(START, 'extractText')
      .addEdge('extractText', 'receiptParser')
      .addEdge('receiptParser', END)
      .compile();
  }
}
