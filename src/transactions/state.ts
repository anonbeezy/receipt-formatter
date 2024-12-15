import { Annotation } from '@langchain/langgraph';
import {
  Transaction as ExtractedTransaction,
  LineItem,
  Store,
} from '../receipt-processing/schemas';
import { Transaction } from './schemas';
import { Payee } from '../payees/schemas';
import { Category } from '../categories/schemas';
import { SaveTransactionsResponseData } from 'ynab';

export const TransactionState = Annotation.Root({
  extractedTransaction: Annotation<ExtractedTransaction>,
  extractedLineItems: Annotation<LineItem[]>,
  extractedStore: Annotation<Store>,
  payee: Annotation<Payee>,
  category: Annotation<Category>,
  transaction: Annotation<Transaction>,
  apiResponse: Annotation<SaveTransactionsResponseData>,
});
