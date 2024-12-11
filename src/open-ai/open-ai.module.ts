import { ChatOpenAI } from '@langchain/openai';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ChatOpenAI,
      useFactory: (configService: ConfigService) => {
        return new ChatOpenAI({
          apiKey: configService.get('openai.apiKey'),
          model: 'gpt-4o-mini',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [ChatOpenAI],
})
export class OpenAiModule {}
