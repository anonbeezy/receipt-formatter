import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { TelegramBotException } from './common/exceptions/telegram.exception';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly bot: Telegraf,
    @InjectQueue('telegram-messages') private telegramMessagesQueue: Queue,
  ) {}

  private setupBotHandlers() {
    this.bot.on(message('photo'), async (ctx) => {
      try {
        const photo = ctx.message.photo.pop(); // Get highest resolution photo
        const imageUrl = await ctx.telegram.getFileLink(photo.file_id);

        this.logger.log(`Queuing photo job for URL: ${imageUrl}`);

        // Queue the photo processing job
        await this.telegramMessagesQueue.add('handleImage', {
          imageUrl,
          chatId: ctx.message.chat.id,
        });
        await ctx.reply('Your photo is being processed!');
      } catch (error) {
        this.logger.error('Failed to queue photo job', error);
        await ctx.reply('Failed to process your photo.');
      }
    });
  }

  public async sendMessage(chatId: number, message: string) {
    try {
      this.logger.log(`Sending message to chat ${chatId}`);
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      throw new TelegramBotException(
        `Failed to send message to chat ${chatId}`,
        error,
      );
    }
  }

  public startBot() {
    this.bot.start((ctx) => ctx.reply('Welcome'));
    this.bot.help((ctx) => ctx.reply('Send me a photo of a receipt'));
    this.bot.launch();
    this.logger.log('Bot started successfully');
  }

  public stopBot() {
    this.bot.stop('SIGINT');
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    this.logger.log('Bot stopped successfully');
  }

  onModuleInit() {
    this.setupBotHandlers();
    this.startBot();
  }

  onModuleDestroy() {
    this.stopBot();
  }
}
