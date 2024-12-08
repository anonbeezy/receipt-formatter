import { END, START, StateGraph } from '@langchain/langgraph';
import { OcrState } from './state';
import { ExtractTextNode } from './nodes/extract';
import { TransformNode } from './nodes/transform';
import { FormatNode } from './nodes/format';

import { ChatOpenAI } from '@langchain/openai';
import { OcrService } from './ocr.service';
import * as path from 'path';
import * as vision from '@google-cloud/vision';

export class OcrApp {
  constructor(
    private readonly transformNode: TransformNode,
    private readonly extractTextNode: ExtractTextNode,
    private readonly formatNode: FormatNode,
  ) {}
  initialize() {
    return new StateGraph(OcrState)
      .addNode('extractText', this.extractTextNode)
      .addNode('transform', this.transformNode)
      .addNode('formatReceipt', this.formatNode)
      .addEdge(START, 'extractText')
      .addEdge('extractText', 'transform')
      .addEdge('transform', 'formatReceipt')
      .addEdge('formatReceipt', END)
      .compile();
  }
}

export const createApp = (model: ChatOpenAI) => {
  // Directory for image downloads
  const projectDirpath = path.resolve(process.cwd());
  const downloadsDirpath = path.resolve(projectDirpath, 'downloads');

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: `${projectDirpath}/service-account-key.json`, // Update with your path
  });

  const ocrService = new OcrService(downloadsDirpath, client);

  const transformNode = new TransformNode(model);
  const extractTextNode = new ExtractTextNode(ocrService);
  const formatReceiptNode = new FormatNode(model);

  const app = new OcrApp(
    transformNode,
    extractTextNode,
    formatReceiptNode,
  ).initialize();

  return app;
};
