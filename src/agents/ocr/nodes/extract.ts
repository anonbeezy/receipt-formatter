import { ToolNode } from '@langchain/langgraph/prebuilt';
import { OcrService } from '../ocr.service';
import { randomUUID } from 'crypto';
import { OcrState } from '../state';

export class ExtractTextNode extends ToolNode {
  constructor(private readonly ocrService: OcrService) {
    super([]);
  }

  async run(state: typeof OcrState.State) {
    console.log('Executing extractTextNode');
    const ocrResult = await this.ocrService.execute(state.imageUrl);
    return {
      receipt: ocrResult,
    };
  }
}
