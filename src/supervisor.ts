import { z } from 'zod'
import { JsonOutputToolsParser } from '@langchain/core/output_parsers/openai_tools'
import { ChatOpenAI } from '@langchain/openai'
import { END } from '@langchain/langgraph'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'

const members = [
  'receiptFormatter',
  'accountsFetcher',
  'budgetCategoriesFetcher',
  'payeesFetcher',
  'transactionCreator',
] as const

const systemPrompt =
  'You are a supervisor tasked with managing a conversation between the' +
  ' following workers: {members}. Given the following user request,' +
  ' respond with the worker to act next. Each worker will perform a' +
  ' task and respond with their results and status. When finished,' +
  ' respond with FINISH.'
const options = [END, ...members]

// Define routing function
const routingTool = {
  name: 'route',
  description: 'Select the next role.',
  schema: z.object({
    next: z.enum([END, ...members]),
  }),
}

const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt],
  new MessagesPlaceholder('messages'),
  [
    'system',
    'Given the conversation above, who should act next?' +
      ' Or should we FINISH? Select one of: {options}',
  ],
])

export const createSupervisorChain = async () => {
  const formattedPrompt = await prompt.partial({
    options: options.join(', '),
    members: members.join(', '),
  })

  const llm = new ChatOpenAI({
    modelName: 'gpt-4o',
    apiKey: process.env.OPENAI_TOKEN,
    temperature: 0,
  })

  return formattedPrompt
    .pipe(
      llm.bindTools([routingTool], {
        tool_choice: 'route',
      })
    )
    .pipe(new JsonOutputToolsParser())

    .pipe((x) => x[0].args)
}
