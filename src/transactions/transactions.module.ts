import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsGraph } from './transactions.graph';
import { CreateNode } from './nodes/create';
import { YnabModule } from 'src/ynab/ynab.module';

@Module({
  imports: [YnabModule],
  providers: [TransactionsService, CreateNode, TransactionsGraph],
  exports: [TransactionsGraph],
})
export class TransactionsModule {}
