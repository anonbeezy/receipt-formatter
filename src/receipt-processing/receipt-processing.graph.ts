import { END, START, StateGraph } from '@langchain/langgraph';
import { ReceiptProcessingState } from './state';
import { ExtractTextNode } from './nodes/extract';
import { FormatNode } from './nodes/format';
import { TransformNode } from './nodes/transform';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceiptProcessingGraph {
  constructor(
    private readonly extractNode: ExtractTextNode,
    private readonly formatNode: FormatNode,
    private readonly transformNode: TransformNode,
  ) {}
  compile() {
    return new StateGraph(ReceiptProcessingState)
      .addNode('extractText', this.extractNode)
      .addNode('transform', this.transformNode)
      .addNode('formatReceipt', this.formatNode)
      .addEdge(START, 'extractText')
      .addEdge('extractText', 'transform')
      .addEdge('transform', 'formatReceipt')
      .addEdge('formatReceipt', END)
      .compile();
  }
}
