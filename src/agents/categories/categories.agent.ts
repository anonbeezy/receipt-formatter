import { CategoriesService } from './categories.service';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { CategoriesTool } from './categories.tool';
interface CreateAgentParams {
  llm: ChatOpenAI;
}
// TODO: Insert categories dynamically
export const createAgent = (params: CreateAgentParams) => {
  const categoriesService = new CategoriesService();
  // const categoriesTool = new CategoriesTool(categoriesService);
  return createReactAgent({
    llm: params.llm,
    tools: [],
    messageModifier: `You are an helpful assistant searching categories in the CSV below and using hints.

categories.csv:
---
{csv_content}
---

hints:
- ride share is a form of transportation
    `,
  });
};
