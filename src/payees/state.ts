import { Annotation } from '@langchain/langgraph';
import { Payee } from './schemas';

export const PayeesState = Annotation.Root({
  payeeName: Annotation<string>,
  rawPayee: Annotation<string>,
  payee: Annotation<Payee>,
});
