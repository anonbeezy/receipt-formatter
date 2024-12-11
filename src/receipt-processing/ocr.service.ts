import * as path from 'path';
import { createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import * as vision from '@google-cloud/vision';
import { Writable } from 'node:stream';
import { randomUUID } from 'crypto';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { IMAGE_DOWNLOADS_DIRPATH } from './constants';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  constructor(
    @Inject(IMAGE_DOWNLOADS_DIRPATH)
    private readonly imageDownloadsDirpath: string,
    private readonly imageAnnotatorClient: vision.ImageAnnotatorClient,
  ) {}

  async execute(imageUrl: string | URL) {
    // Download the photo
    this.logger.log(
      `Downloading image from ${imageUrl} to directory: ${this.imageDownloadsDirpath}`,
    );
    const photoPath = path.join(
      this.imageDownloadsDirpath,
      `${randomUUID()}.jpg`,
    );
    const response = await fetch(imageUrl);
    await response.body!.pipeTo(Writable.toWeb(createWriteStream(photoPath)));

    // Perform text detection on the image file
    this.logger.log('Performing OCR...');
    const [result] =
      await this.imageAnnotatorClient.documentTextDetection(photoPath);

    this.logger.log('Cleaning up...');
    await unlink(photoPath);

    return result.fullTextAnnotation?.text;
  }
}
