import { registerAs } from '@nestjs/config';

export default registerAs('ynab', () => ({
  budgetId: process.env.YNAB_BUDGET_ID,
  accountId: process.env.YNAB_ACCOUNT_ID,
  accessToken: process.env.YNAB_ACCESS_TOKEN,
}));
