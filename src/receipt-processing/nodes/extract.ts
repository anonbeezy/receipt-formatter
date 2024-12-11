import { ToolNode } from '@langchain/langgraph/prebuilt';
import { OcrService } from '../ocr.service';
import { ReceiptProcessingState } from '../state';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExtractTextNode extends ToolNode {
  private readonly logger = new Logger(ExtractTextNode.name);
  constructor(private readonly ocrService: OcrService) {
    super([]);
  }

  async run(state: typeof ReceiptProcessingState.State) {
    this.logger.log('Executing extractTextNode');
    const ocrResult = await this.ocrService.execute(state.imageUrl);
    return {
      receipt: ocrResult,
    };
  }
}
