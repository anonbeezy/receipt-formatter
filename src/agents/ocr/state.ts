import { Annotation } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { LineItem, Store, Transaction } from './schemas';

export const OcrState = Annotation.Root({
  imageUrl: Annotation<string | URL>,
  receipt: Annotation<string>,
  rawTransaction: Annotation<string>,
  transaction: Annotation<Transaction>,
  lineItems: Annotation<LineItem[]>,
  store: Annotation<Store>,
});
