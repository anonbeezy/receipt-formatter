import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { ReceiptProcessingGraph } from './receipt-processing.graph';
import { TransformNode } from './nodes/transform';
import { FormatNode } from './nodes/format';
import { ExtractTextNode } from './nodes/extract';
import { IMAGE_DOWNLOADS_DIRPATH } from './constants';
import * as vision from '@google-cloud/vision';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { mkdir } from 'node:fs/promises';

@Module({
  imports: [ConfigModule, OpenAiModule],
  providers: [
    OcrService,
    ExtractTextNode,
    FormatNode,
    TransformNode,
    ReceiptProcessingGraph,
    {
      provide: IMAGE_DOWNLOADS_DIRPATH,
      useFactory: async (configService: ConfigService) => {
        const dirpath = configService.get(
          'imageProcessing.imageDownloadsDirpath',
        );

        await mkdir(dirpath, { recursive: true });
        return dirpath;
      },
      inject: [ConfigService],
    },
    {
      provide: vision.ImageAnnotatorClient,
      useFactory: () =>
        new vision.ImageAnnotatorClient({
          // TODO: Refactor cwd out
          keyFilename: `${process.cwd()}/service-account-key.json`,
        }),
      inject: [ConfigService],
    },
  ],
  exports: [ReceiptProcessingGraph],
})
export class ReceiptProcessingModule {}
