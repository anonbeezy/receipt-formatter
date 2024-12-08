import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { createApp } from './app';

// Initialize the OpenAI model
export const model = new ChatOpenAI({
  model: 'gpt-4',
  temperature: 0.5, // Adjust as needed
});

(async () => {
  const app = createApp(model);

  const result = await app.stream(
    {
      payeeName: 'Alfama',
    },
    {
      debug: true,
      configurable: {
        thread_id: '1',
      },
      streamMode: 'updates',
      subgraphs: true,
    },
  );

  for await (const update of result) {
    console.log(JSON.stringify(update, null, 2));
  }
})();
