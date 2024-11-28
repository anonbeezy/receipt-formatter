import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import * as path from 'path'
import * as fs from 'fs'
import { Writable } from 'stream'
import * as vision from '@google-cloud/vision'
import { llmChain } from './chatgpt'
import { YnabService } from './ynab.service'

// Create a bot that uses 'polling' to fetch new updates
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)
const ynabService = new YnabService(process.env.YNAB_ACCESS_TOKEN!)

// Directory for image downloads
const projectDirpath = path.resolve(process.cwd())
const downloadsDirpath = path.resolve(projectDirpath, 'downloads')

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: `${projectDirpath}/service-account-key.json`, // Update with your path
})

// Function to perform OCR
async function performOCR(imagePath: string) {
  // Perform text detection on the image file
  const [result] = await client.documentTextDetection(imagePath)
  return result.fullTextAnnotation?.text
}

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (ctx) => {
//   // send a message to the chat acknowledging receipt of their message
//   ctx.sendMessage('Received your message')
// })

bot.on(message('photo'), async (ctx) => {
  const photo = ctx.message.photo.pop()
  if (!photo) {
    return
  }
  const photoId = photo.file_id // Get the highest resolution photo
  const fileLink = await ctx.telegram.getFileLink(photoId)

  // Download the photo
  const photoPath = path.join(downloadsDirpath, `${photoId}.jpg`)
  const response = await fetch(fileLink)
  await response.body!.pipeTo(Writable.toWeb(fs.createWriteStream(photoPath)))
  // const buffer = Buffer.from(await response.arrayBuffer())
  // fs.writeFileSync(photoPath, buffer)

  try {
    // Perform OCR on the downloaded image

    const receiptText = await performOCR(photoPath).catch(console.error)
    // const prompt = createPrompt(receiptText)
    // const chatResponse = await sendPrompt(prompt)

    // ctx.reply(chatResponse)

    // Send the OCR result back to the user
    // ctx.reply(`Extracted Text: ${text}`)

    if (!receiptText) {
      ctx.reply('Could not read receipt')
    } else {
      const chatResponse = await llmChain.invoke({ receipt: receiptText })
      ctx.reply(chatResponse)
    }
  } catch (error) {
    ctx.reply('Error processing the image.')
  } finally {
    // Optionally delete the file after processing
    fs.unlinkSync(photoPath)
  }
})

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a photo of a receipt'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
