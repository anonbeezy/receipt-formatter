import { Injectable, Logger } from '@nestjs/common';
import { TransactionState } from '../state';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { TransactionsService } from '../transactions.service';
import { Payee } from 'src/payees/schemas';
import { Transaction } from '../schemas';

const getPayeeIdOrName = (
  transaction: Transaction,
  payee: Payee,
): Pick<Transaction, 'payeeId' | 'payeeName'> => {
  return payee.id === null
    ? { payeeId: null, payeeName: payee.name }
    : { payeeId: payee.id, payeeName: null };
};

@Injectable()
export class CreateTransactionNode extends ToolNode {
  private readonly logger = new Logger(CreateTransactionNode.name);
  constructor(private readonly transactionsService: TransactionsService) {
    super([]);
  }
  async run(state: typeof TransactionState.State) {
    this.logger.log('Executing createNode');

    const { extractedTransaction, category, payee } = state;

    try {
      const apiResponse = await this.transactionsService.create({
        date: extractedTransaction.date
          ? new Date(extractedTransaction.date).toISOString()
          : new Date().toISOString(),
        amount: extractedTransaction.amount,
        ...getPayeeIdOrName(extractedTransaction, payee),
        categoryId: category ? category.id : null,
      });
      return {
        apiResponse,
      };
    } catch (e) {
      return {
        apiResponse: e,
      };
    }
  }
}
