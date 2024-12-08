import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import * as path from 'path';
import * as fs from 'fs';
import { Writable } from 'stream';
import * as vision from '@google-cloud/vision';
import { llmChain } from './chatgpt';
// import { YnabService } from './ynab.service'
import { rootApp } from './main';

// Create a bot that uses 'polling' to fetch new updates
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
// const ynabService = new YnabService(process.env.YNAB_ACCESS_TOKEN!)

// Directory for image downloads
const projectDirpath = path.resolve(process.cwd());
const downloadsDirpath = path.resolve(projectDirpath, 'downloads');

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: `${projectDirpath}/service-account-key.json`, // Update with your path
});

// Function to perform OCR
async function performOCR(imagePath: string) {
  // Perform text detection on the image file
  const [result] = await client.documentTextDetection(imagePath);
  return result.fullTextAnnotation?.text;
}

bot.on(message('photo'), async (ctx) => {
  const photo = ctx.message.photo.pop();
  if (!photo) {
    return;
  }

  const photoId = photo.file_id; // Get the highest resolution photo
  const fileLink = await ctx.telegram.getFileLink(photoId);

  ctx.reply('Processing...');
  const result = await rootApp.invoke({ imageUrl: fileLink }, { debug: true });
  console.log('final state', result);
  ctx.reply('Done!');
});

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a photo of a receipt'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
