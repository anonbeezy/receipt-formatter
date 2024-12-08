import 'dotenv/config';
import { PayeesService } from './payees.service';
import { YnabService } from '../../services/ynab.service';

(async () => {
  const ynabService = new YnabService(process.env.YNAB_PERSONAL_TOKEN!, {
    budgetId: process.env.BUDGET_ID!,
    accountId: process.env.ACCOUNT_ID!,
  });
  const payeesService = new PayeesService(ynabService);
  await payeesService.load();

  console.log(payeesService.findAll('name:alfama*'));
  // console.log(payeesService.count());
})();
