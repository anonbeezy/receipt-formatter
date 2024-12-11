import { Annotation } from '@langchain/langgraph';
import { LineItem, Store, Transaction } from './schemas';

export const ReceiptProcessingState = Annotation.Root({
  imageUrl: Annotation<string | URL>,
  receipt: Annotation<string>,
  rawTransaction: Annotation<string>,
  extractedTransaction: Annotation<Transaction>,
  extractedLineItems: Annotation<LineItem[]>,
  extractedStore: Annotation<Store>,
});
