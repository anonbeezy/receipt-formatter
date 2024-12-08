import 'dotenv/config';
import { YnabService } from './ynab.service';

const categories = {
  data: {
    category_groups: [],
    server_knowledge: 461,
  },
};
(async () => {
  const ynabService = new YnabService(process.env.YNAB_PERSONAL_TOKEN!);
  const budgetId = process.env.BUDGET_ID!;
  const accountId = process.env.ACCOUNT_ID!;
  try {
    // const test = categories.data.category_groups
    //   .filter((x) => !x.hidden || !x.deleted)
    //   .flatMap((x) => x.categories as any[])
    //   .filter((x) => !x.hidden || !x.deleted)
    //   .map(({ id, name }) => ({ id, name }));
    // console.log(test);
    console.log(JSON.stringify(await ynabService.getPayees(budgetId), null, 2));
    // console.log(
    //   JSON.stringify(await ynabService.getCategories(budgetId), null, 2)
    // );
    // console.log(
    //   JSON.stringify(await ynabService.getAccounts(budgetId), null, 2),
    // )
    // await ynabService.createTransaction(
    //   budgetId,
    //   accountId,
    //   '2024-11-27',
    //   1000,
    //   '7-11',
    // )
  } catch (e) {
    console.log(e);
  }
})();
