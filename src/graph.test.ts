import 'dotenv/config';
import { graph } from './graph';
import { HumanMessage } from '@langchain/core/messages';

import { llmChain } from './chatgpt';
(async () => {
  let streamResults = graph.stream(
    {
      // TODO: Add receipt content
      receipt: ``,
      messages: [
        new HumanMessage({
          content: 'What were the 3 most popular tv shows in 2023?',
        }),
      ],
    },
    { recursionLimit: 100 }
  );

  for await (const output of await streamResults) {
    if (!output?.__end__) {
      console.log(output);
      console.log('----');
    }
  }
})();
