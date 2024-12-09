import * as ynab from 'ynab';
import type { NewTransaction } from 'ynab';

interface YnabServiceConfig {
  budgetId: string;
  accountId: string;
}
export class YnabService {
  private api: ynab.API;
  private budgetId: string | null;
  private accountId: string | null;
  constructor(accessToken: string, config?: YnabServiceConfig) {
    this.budgetId = config?.budgetId ?? null;
    this.accountId = config?.accountId ?? null;
    this.api = new ynab.API(accessToken);
  }

  async createTransaction(transaction: Omit<NewTransaction, 'account_id'>) {
    if (!this.budgetId) {
      throw new Error('Budget ID required');
    }
    if (!this.accountId) {
      throw new Error('Account ID required');
    }

    console.log('creating transaction', JSON.stringify(transaction, null, 2));
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
