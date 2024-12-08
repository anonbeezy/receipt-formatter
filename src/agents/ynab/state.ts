import { Annotation } from '@langchain/langgraph';
import { YnabTransaction } from './schemas';
import { LineItem, Transaction } from '../ocr/schemas';
import { Payee } from '../payees/schemas';
import { Category } from '../categories/schemas';
import { SaveTransactionsResponseData } from 'ynab';

export const YnabState = Annotation.Root({
  ynabTransaction: Annotation<YnabTransaction>,
  transaction: Annotation<Transaction>,
  lineItems: Annotation<LineItem[]>,
  payee: Annotation<Payee>,
  category: Annotation<Category>,
  apiResponse: Annotation<SaveTransactionsResponseData>,
});
