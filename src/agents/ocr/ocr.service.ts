import * as path from 'path';
import * as fs from 'fs';
import * as vision from '@google-cloud/vision';
import { Writable } from 'stream';
import { randomUUID } from 'crypto';

export class OcrService {
  constructor(
    private readonly imageDownloadsDirpath: string,
    private readonly imageAnnotatorClient: vision.ImageAnnotatorClient,
  ) {}

  async execute(imageUrl: string | URL) {
    // Download the photo
    console.log('Downloading photo...', imageUrl);
    const photoPath = path.join(
      this.imageDownloadsDirpath,
      `${randomUUID()}.jpg`,
    );
    const response = await fetch(imageUrl);
    await response.body!.pipeTo(
      Writable.toWeb(fs.createWriteStream(photoPath)),
    );

    // Perform text detection on the image file
    console.log('Performing OCR...', photoPath);
    const [result] =
      await this.imageAnnotatorClient.documentTextDetection(photoPath);

    console.log('Cleaning up...', photoPath);
    fs.unlinkSync(photoPath);

    return result.fullTextAnnotation?.text;
  }
}
