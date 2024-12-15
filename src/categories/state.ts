import { Annotation } from '@langchain/langgraph';
import { Category } from './schemas';
import { LineItem } from 'src/receipt-processing/schemas';

export const CategoriesState = Annotation.Root({
  categoryName: Annotation<string>,
  category: Annotation<Category>,
  extractedLineItems: Annotation<LineItem[]>,
});
