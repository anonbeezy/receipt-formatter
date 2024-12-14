import { Injectable } from '@nestjs/common';
import {
  Annotation,
  CompiledStateGraph,
  END,
  START,
  StateGraph,
} from '@langchain/langgraph';

import {
  LineItem,
  Transaction as ExtractedTransaction,
  Store,
} from './receipt-processing/schemas';
import { Category } from './categories/schemas';
import { Payee } from './payees/schemas';
import { Transaction } from './transactions/schemas';

import { CategoriesGraph } from './categories/categories.graph';
import { PayeesGraph } from './payees/payees.graph';
import { ReceiptProcessingGraph } from './receipt-processing/receipt-processing.graph';
import { TransactionsGraph } from './transactions/transactions.graph';

const OverallStateAnnotation = Annotation.Root({
  // Input
  imageUrl: Annotation<string | URL>,

  // From receipt processing
  extractedTransaction: Annotation<ExtractedTransaction>,
  extractedLineItems: Annotation<LineItem[]>,
  extractedStore: Annotation<Store>,

  // From categories
  category: Annotation<Category>,

  // From payees
  payee: Annotation<Payee>,

  // From transactions
  transaction: Annotation<Transaction>,
});

type State = typeof OverallStateAnnotation.State;
type Update = typeof OverallStateAnnotation.Update;
type spec = typeof OverallStateAnnotation.spec;
export type AppStateGraph = CompiledStateGraph<
  State,
  Update,
  '__start__' | 'receiptProcessing' | 'categories' | 'payees' | 'transactions',
  spec,
  spec
>;

@Injectable()
export class AppService {
  private compiledStateGraph: AppStateGraph;
  constructor(
    private readonly categoriesGraph: CategoriesGraph,
    private readonly payeesGraph: PayeesGraph,
    private readonly receiptProcessingGraph: ReceiptProcessingGraph,
    private readonly transactionsGraph: TransactionsGraph,
  ) {
    const receiptProcessingApp = this.receiptProcessingGraph.compile();
    const categoriesApp = this.categoriesGraph.compile();
    const payeesApp = this.payeesGraph.compile();
    const transactionsApp = this.transactionsGraph.compile();

    this.compiledStateGraph = new StateGraph(OverallStateAnnotation)
      .addNode('receiptProcessing', receiptProcessingApp)
      .addNode('categories', (state: typeof OverallStateAnnotation.State) => {
        if (!state.extractedTransaction.categoryName) {
          return { category: null };
        }

        return categoriesApp.invoke({
          categoryName: state.extractedTransaction.categoryName,
        });
      })
      .addNode('payees', (state: typeof OverallStateAnnotation.State) =>
        payeesApp.invoke({
          payeeName: state.extractedStore.name,
        }),
      )
      .addNode('transactions', (state: typeof OverallStateAnnotation.State) =>
        transactionsApp.invoke({
          extractedTransaction: state.extractedTransaction,
          category: state.category,
          payee: state.payee,
        }),
      )
      .addEdge(START, 'receiptProcessing')
      .addEdge('receiptProcessing', 'categories')
      .addEdge('categories', 'payees')
      .addEdge('payees', 'transactions')
      .addEdge('transactions', END)
      .compile();
  }

  async processReceiptImage(imageUrl: string) {
    return this.compiledStateGraph.invoke({
      imageUrl,
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
