import { Module } from '@nestjs/common';
import { YnabService } from './ynab.service';
import * as ynab from 'ynab';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { YNAB_API, YNAB_BUDGET_ID, YNAB_ACCOUNT_ID } from './constants';

@Module({
  imports: [ConfigModule],
  providers: [
    YnabService,
    {
      provide: YNAB_API,
      useFactory: (configService: ConfigService) => {
        return new ynab.API(configService.get('ynab.accessToken'));
      },
      inject: [ConfigService],
    },
    {
      provide: YNAB_BUDGET_ID,
      useFactory: (configService: ConfigService) => {
        return configService.get('ynab.budgetId');
      },
      inject: [ConfigService],
    },
    {
      provide: YNAB_ACCOUNT_ID,
      useFactory: (configService: ConfigService) => {
        return configService.get('ynab.accountId');
      },
      inject: [ConfigService],
    },
  ],
  exports: [YnabService],
})
export class YnabModule {}
