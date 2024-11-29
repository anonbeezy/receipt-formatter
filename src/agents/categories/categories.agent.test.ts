import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from './categories.agent'


(async () => {
  const results = await createAgent({
    llm: new ChatOpenAI({
      model: 'gpt-4',
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7, // Adjust as needed
    })

  }).invoke({ messages: [{role: 'user', content:'Suggest the best matching category using the text: uber'}] })
  console.log(results)
})()
//Find a category using the text: taxi. Return the ID in plain text
