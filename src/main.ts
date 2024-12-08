import { createApp as createOcrApp } from './agents/ocr/app';
import { createApp as createCategoriesApp } from './agents/categories/app';
import { createApp as createPayeesApp } from './agents/payees/app';
import { createApp as createYnabApp } from './agents/ynab/app';
import { ChatOpenAI } from '@langchain/openai';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { Transaction } from './agents/ocr/schemas';
import { Category } from './agents/categories/schemas';
import { Payee } from './agents/payees/schemas';
import { YnabState } from './agents/ynab/state';
import { Context } from 'telegraf';

// Initialize the OpenAI model
export const model = new ChatOpenAI({
  model: 'gpt-4',
  temperature: 0.5, // Adjust as needed
});

// Create apps
const ocrApp = createOcrApp(model);
const categoriesApp = createCategoriesApp(model);
const payeesApp = createPayeesApp(model);
const ynabApp = createYnabApp(model);

// Parent Graph
const ParentAnnotationState = Annotation.Root({
  ...YnabState.spec,
  imageUrl: Annotation<string | URL>,
  transaction: Annotation<Transaction>,
  category: Annotation<Category>,
  payee: Annotation<Payee>,
});

export const rootApp = new StateGraph(ParentAnnotationState)
  .addNode('ocr', ocrApp)
  .addNode('categories', (state: typeof ParentAnnotationState.State) =>
    categoriesApp.invoke({
      categoryName: state.transaction.categoryName,
    }),
  )
  .addNode('payees', (state: typeof ParentAnnotationState.State) =>
    payeesApp.invoke({
      payeeName: state.transaction.payeeName,
    }),
  )
  .addNode('ynab', (state: typeof ParentAnnotationState.State) =>
    ynabApp.invoke({
      transaction: state.transaction,
      category: state.category,
      payee: state.payee,
    }),
  )
  .addEdge(START, 'ocr')
  .addEdge('ocr', 'categories')
  .addEdge('categories', 'payees')
  .addEdge('payees', 'ynab')
  .addEdge('ynab', END)
  .compile();
