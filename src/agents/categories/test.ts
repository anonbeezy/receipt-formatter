import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { TransformNode } from './nodes/transform';
import { FormatNode } from './nodes/format';
import { CategoriesApp } from './app';
import { CategoriesService } from './categories.service';

// Initialize the OpenAI model
export const model = new ChatOpenAI({
  model: 'gpt-4',
  temperature: 0.5, // Adjust as needed
});

(async () => {
  const categoriesService = new CategoriesService();
  const transformNode = new TransformNode(
    model,
    categoriesService.getCsvString(),
  );
  const formatNode = new FormatNode(model);

  const app = new CategoriesApp(transformNode, formatNode).initialize();

  const result = await app.stream(
    {
      categoryName: 'Food',
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
    console.log(update);
  }
})();
