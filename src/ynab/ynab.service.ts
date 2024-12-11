import * as ynab from 'ynab';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NewTransaction } from 'ynab';
import { YNAB_ACCOUNT_ID, YNAB_API, YNAB_BUDGET_ID } from './constants';

@Injectable()
export class YnabService {
  private readonly logger = new Logger(YnabService.name);
  constructor(
    @Inject(YNAB_API) private readonly api: ynab.API,
    @Inject(YNAB_BUDGET_ID) private readonly budgetId: string,
    @Inject(YNAB_ACCOUNT_ID) private readonly accountId: string,
  ) {}

  async createTransaction(transaction: Omit<NewTransaction, 'account_id'>) {
    if (!this.budgetId) {
      throw new Error('Budget ID required');
    }
    if (!this.accountId) {
      throw new Error('Account ID required');
    }

    this.logger.log(
      'Creating transaction',
      JSON.stringify(transaction, null, 2),
    );
    return this.api.transactions.createTransaction(this.budgetId, {
      transaction: {
        ...transaction,
        account_id: this.accountId,
      },
    });
  }

  async getAccounts(inputBudgetId?: string) {
    const budgetId = inputBudgetId ?? this.budgetId;
    if (!budgetId) {
      throw new Error('Budget ID required');
    }
    return this.api.accounts.getAccounts(budgetId);
  }

  async getCategories(inputBudgetId?: string) {
    const budgetId = inputBudgetId ?? this.budgetId;
    if (!budgetId) {
      throw new Error('Budget ID required');
    }
    return this.api.categories.getCategories(budgetId);
  }

  async getPayees(inputBudgetId?: string) {
    const budgetId = inputBudgetId ?? this.budgetId;
    if (!budgetId) {
      throw new Error('Budget ID required');
    }
    return this.api.payees.getPayees(budgetId);
  }
}
