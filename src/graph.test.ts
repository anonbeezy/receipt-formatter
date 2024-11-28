import 'dotenv/config'
import { graph } from './graph'
import { HumanMessage } from '@langchain/core/messages'

let streamResults = graph.stream(
  {
    messages: [
      new HumanMessage({
        content: "What were the 3 most popular tv shows in 2023?",

      }, {
        receipt: ``
      }),
    ],
  },
  { recursionLimit: 100 },
);

for await (const output of await streamResults) {
  if (!output?.__end__) {
    console.log(output);
    console.log("----");
  }
}
