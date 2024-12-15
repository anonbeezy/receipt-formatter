import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsGraph } from './transactions.graph';
import { CreateTransactionNode } from './nodes/create-transaction';
import { YnabModule } from 'src/ynab/ynab.module';

@Module({
  imports: [YnabModule],
  providers: [TransactionsService, CreateTransactionNode, TransactionsGraph],
  exports: [TransactionsGraph],
})
export class TransactionsModule {}
