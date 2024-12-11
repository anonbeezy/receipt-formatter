import { Injectable, Logger } from '@nestjs/common';
import { YnabService } from 'src/ynab/ynab.service';
import { NewTransaction } from 'ynab';
import { Transaction } from './schemas';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  constructor(private readonly ynabService: YnabService) {}
  async create(transaction: Transaction) {
    this.logger.log('Creating transaction');
    const ynabTransaction: NewTransaction = {
      date: transaction.date
        ? new Date(transaction.date).toISOString()
        : new Date().toISOString(),
      amount: transaction.amount,
      payee_id: transaction.payeeId,
      payee_name: transaction.payeeName,
      category_id: transaction.categoryId,
      memo: transaction.memo,
    };

    return this.ynabService.createTransaction(ynabTransaction);
  }
}
