import { Annotation } from '@langchain/langgraph';
import { Category } from './schemas';

export const CategoriesState = Annotation.Root({
  categoryName: Annotation<string>,
  rawCategory: Annotation<string>,
  category: Annotation<Category>,
});
