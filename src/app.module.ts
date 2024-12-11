import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotService } from './bot.service';
import { Telegraf } from 'telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import telegramConfig from './config/telegram.config';
import { BullModule } from '@nestjs/bullmq';
import redisConfig from './config/redis.config';
import { MessageProcessorWorker } from './message-processor.worker';
import { ChatOpenAI } from '@langchain/openai';
import { CategoriesModule } from './categories/categories.module';
import { YnabModule } from './ynab/ynab.module';
import ynabConfig from './config/ynab.config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { PayeesModule } from './payees/payees.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReceiptProcessingModule } from './receipt-processing/receipt-processing.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import imageProcessingConfig from './config/image-processing.config';
import openaiConfig from './config/openai.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
          },
        }),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        telegramConfig,
        redisConfig,
        ynabConfig,
        openaiConfig,
        imageProcessingConfig,
      ],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'telegram-messages',
    }),
    CategoriesModule,
    YnabModule,
    PayeesModule,
    TransactionsModule,
    ReceiptProcessingModule,
    OpenAiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BotService,
    MessageProcessorWorker,
    {
      provide: Telegraf,
      useFactory: (configService: ConfigService) => {
        return new Telegraf(configService.get('telegram.botToken'));
      },
      inject: [ConfigService],
    },
    // {
    //   provide: ChatOpenAI,
    //   useFactory: (configService: ConfigService) => {
    //     return new ChatOpenAI({
    //       apiKey: configService.get('openai.apiKey'),
    //     });
    //   },
    //   inject: [ConfigService],
    // },
    // TODO: Provide YnabService
  ],
})
export class AppModule {}
