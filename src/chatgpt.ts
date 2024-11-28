import { ChatOpenAI } from '@langchain/openai'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { promptTemplate } from './template'

// Initialize the OpenAI model
export const model = new ChatOpenAI({
  model: 'gpt-4',
  apiKey: process.env.OPENAI_TOKEN,
  temperature: 0.7, // Adjust as needed
})

const parser = new StringOutputParser()

export const llmChain = promptTemplate.pipe(model).pipe(parser)
