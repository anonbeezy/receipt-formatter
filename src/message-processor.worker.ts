import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { BotService } from './bot.service';
import { AppService } from './app.service';

@Processor('telegram-messages', {
  maxStalledCount: 3,
  lockDuration: 30000, // 30 seconds
  stalledInterval: 30000,
})
export class MessageProcessorWorker extends WorkerHost {
  private readonly logger = new Logger(MessageProcessorWorker.name);

  constructor(
    private readonly botService: BotService,
    private readonly appService: AppService,
  ) {
    super();
  }

  async process(job: Job) {
    try {
      // Priority-based processing
      this.logger.log(
        `Processing job: ${job.id} with priority: ${job.opts.priority}`,
      );

      switch (job.name) {
        case 'handleImage':
          return this.processHandleImage(job);
        default:
          return this.processDefault(job);
      }
    } catch (error) {
      this.logger.error('Job processing failed', error);

      // Retry mechanism
      if (job.attemptsMade < 3) {
        throw new Error('Retry processing');
      } else {
        this.logger.warn(`Job ${job.id} failed after maximum retries`);
      }
    }
  }

  async processHandleImage(job: Job) {
    const { imageUrl, chatId } = job.data;
    this.logger.log(`Processing image (url: ${imageUrl}): ${job.id}`);

    const result = await this.appService.processReceiptImage(imageUrl);

    this.logger.log(`Job processed successfully: ${JSON.stringify(job.data)}`);
    this.botService.sendMessage(chatId, 'Your photo has been processed!');
  }

  async processDefault(job: Job) {
    this.logger.log(`Processing default message: ${job.id}`);
  }
}
