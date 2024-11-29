import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const parser = new StringOutputParser();

const systemTemplate = 'Translate the following into {language}:';
const promptTemplate = ChatPromptTemplate.fromMessages([
  ['system', systemTemplate],
  ['user', '{text}'],
  // new SystemMessage(systemTemplate),
  // new HumanMessage('{text}'),
]);

// Initialize the OpenAI model
export const model = new ChatOpenAI({
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7, // Adjust as needed
});
(async () => {
  // const result = await model.invoke(messages)
  // await parser.invoke(result)
  // await model.pipe(parser).invoke(messages)
  promptTemplate.pipe(model).pipe(parser).invoke({
    language: 'japanese',
    text: 'Hello. It is bright and sunny today',
  });
})();
