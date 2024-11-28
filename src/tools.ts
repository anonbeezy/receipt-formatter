import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { YnabService } from './ynab.service'

interface GetCategoriesToolData {
  budgetId: string
}

export class GetCategoriesTool extends DynamicStructuredTool {
  constructor(private ynabService: YnabService) {
    super({
      name: 'getCategories',
      description: 'Get budget categories',
      schema: z.object({ budgetId: z.string() }),
      func: async (data: GetCategoriesToolData) => {
        return this.ynabService.getCategories(data.budgetId)
      },
    })
  }
}

interface GetPayeesToolData {
  budgetId: string
}

export class GetPayeesTool extends DynamicStructuredTool {
  constructor(private ynabService: YnabService) {
    super({
      name: 'getPayees',
      description: 'Get payees',
      schema: z.object({ budgetId: z.string() }),
      func: async (data: GetPayeesToolData) => {
        return this.ynabService.getPayees(data.budgetId)
      },
    })
  }
}

interface GetAccountsToolData {
  budgetId: string
}

export class GetAccountsTool extends DynamicStructuredTool {
  constructor(private ynabService: YnabService) {
    super({
      name: 'getAccounts',
      description: 'Get accounts',
      schema: z.object({ budgetId: z.string() }),
      func: async (data: GetAccountsToolData) => {
        return this.ynabService.getAccounts(data.budgetId)
      },
    })
  }
}
