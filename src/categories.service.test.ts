import 'dotenv/config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  CategoriesRetriever,
  CategoriesService,
  CategoriesTool,
} from './categories.service';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { HumanMessage } from '@langchain/core/messages';

(async () => {
  const categoriesService = new CategoriesService();
  // console.log(categoriesService.findAll('wellness'));

  // TODO: Doesn't seem useful, try tool
  // const categoriesRetriever = new CategoriesRetriever(categoriesService);
  // console.log(await categoriesRetriever.invoke('health'));

  // Create RAG chain
  const parser = new StringOutputParser();

  const systemTemplate = `You are an assistant searching for categories. You are an assistantTranslate the following into {language}:
Search: {search}
Category:


`;
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['user', '{text}'],
    // new SystemMessage(systemTemplate),
    // new HumanMessage('{text}'),
  ]);

  const model = new ChatOpenAI({
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7, // Adjust as needed
  });

  const categoriesTool = new CategoriesTool(categoriesService);

  const modelWithTools = model.bindTools([categoriesTool]);

  const messages = [
    new HumanMessage(
      'You are an assistant searching categories. Find a category ID using the text: health'
    ),
  ];

  const aiMessage = await modelWithTools.invoke(messages);

  messages.push(aiMessage);

  for (const toolCall of aiMessage.tool_calls ?? []) {
    if (categoriesTool.name === toolCall.name) {
      const toolMessage = await categoriesTool.invoke(toolCall);
      messages.push(toolMessage);
    }
  }

  // console.log(messages);

  console.log(await modelWithTools.pipe(parser).invoke(messages));
})();
