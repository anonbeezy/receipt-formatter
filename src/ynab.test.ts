import 'dotenv/config'
import { YnabService } from './ynab.service'
  ; (async () => {
    const ynabService = new YnabService(process.env.YNAB_PERSONAL_TOKEN!)
    const budgetId = process.env.BUDGET_ID!
    const accountId = process.env.ACCOUNT_ID!
    try {
      console.log(
        JSON.stringify(await ynabService.getAccounts(budgetId), null, 2),
      )
      await ynabService.createTransaction(
        budgetId,
        accountId,
        '2024-11-27',
        1000,
        '7-11',
      )
    } catch (e) {
      console.log(e)
    }
  })()
