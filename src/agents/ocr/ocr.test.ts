import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { OcrService } from './ocr.service';
import * as path from 'path';
import * as vision from '@google-cloud/vision';
import { TransformNode } from './nodes/transform';
import { ExtractTextNode } from './nodes/extract';
import { FormatNode } from './nodes/format';
import { OcrApp } from './app';

// Directory for image downloads
const projectDirpath = path.resolve(process.cwd());
const downloadsDirpath = path.resolve(projectDirpath, 'downloads');
console.log(projectDirpath, downloadsDirpath);

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: `${projectDirpath}/service-account-key.json`, // Update with your path
});
// Initialize the OpenAI model
export const model = new ChatOpenAI({
  model: 'gpt-4',
  temperature: 0.5, // Adjust as needed
});

(async () => {
  const ocrService = new OcrService(downloadsDirpath, client);

  const transformNode = new TransformNode(model);
  const extractTextNode = new ExtractTextNode(ocrService);
  const formatReceiptNode = new FormatNode(model);

  const app = new OcrApp(
    transformNode,
    extractTextNode,
    formatReceiptNode,
  ).initialize();

  const result = await app.stream(
    {
      imageUrl: `https://live.staticflickr.com/5558/14600361669_b9b5ca56e5_k.jpg`,
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
