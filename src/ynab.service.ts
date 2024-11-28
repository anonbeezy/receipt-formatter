import * as ynab from 'ynab'

export class YnabService {
  private api: ynab.API
  constructor(accessToken: string) {
    this.api = new ynab.API(accessToken)
  }

  async createTransaction(
    budgetId: string,
    accountId: string,
    date: string,
    amount: number,
    payeeName: string,
  ) {
    await this.api.transactions.createTransaction(budgetId, {
      transaction: {
        account_id: accountId,
        date,
        amount,
        payee_name: payeeName,
      },
    })
  }

  async getAccounts(budgetId: string) {
    return this.api.accounts.getAccounts(budgetId)
  }

  async getCategories(budgetId: string) {
    return this.api.categories.getCategories(budgetId)
  }

  async getPayees(budgetId: string) {
    return this.api.payees.getPayees(budgetId)
  }
}

export interface NewTransaction {
  /**
   *
   * @type {string}
   * @memberof NewTransaction
   */
  account_id?: string
  /**
   * The transaction date in ISO format (e.g. 2016-12-01).  Future dates (scheduled transactions) are not permitted.  Split transaction dates cannot be changed and if a different date is supplied it will be ignored.
   * @type {string}
   * @memberof NewTransaction
   */
  date?: string
  /**
   * The transaction amount in milliunits format.  Split transaction amounts cannot be changed and if a different amount is supplied it will be ignored.
   * @type {number}
   * @memberof NewTransaction
   */
  amount?: number
  /**
   * The payee for the transaction.  To create a transfer between two accounts, use the account transfer payee pointing to the target account.  Account transfer payees are specified as `transfer_payee_id` on the account resource.
   * @type {string}
   * @memberof NewTransaction
   */
  payee_id?: string | null
  /**
   * The payee name.  If a `payee_name` value is provided and `payee_id` has a null value, the `payee_name` value will be used to resolve the payee by either (1) a matching payee rename rule (only if `import_id` is also specified) or (2) a payee with the same name or (3) creation of a new payee.
   * @type {string}
   * @memberof NewTransaction
   */
  payee_name?: string | null
  /**
   * The category for the transaction.  To configure a split transaction, you can specify null for `category_id` and provide a `subtransactions` array as part of the transaction object.  If an existing transaction is a split, the `category_id` cannot be changed.  Credit Card Payment categories are not permitted and will be ignored if supplied.
   * @type {string}
   * @memberof NewTransaction
   */
  category_id?: string | null
  /**
   *
   * @type {string}
   * @memberof NewTransaction
   */
  memo?: string | null
  /**
   *
   * @type {TransactionClearedStatus}
   * @memberof NewTransaction
   */
  cleared?: TransactionClearedStatus
  /**
   * Whether or not the transaction is approved.  If not supplied, transaction will be unapproved by default.
   * @type {boolean}
   * @memberof NewTransaction
   */
  approved?: boolean
  /**
   *
   * @type {TransactionFlagColor}
   * @memberof NewTransaction
   */
  flag_color?: TransactionFlagColor | null
  /**
   * An array of subtransactions to configure a transaction as a split. Updating `subtransactions` on an existing split transaction is not supported.
   * @type {Array<SaveSubTransaction>}
   * @memberof NewTransaction
   */
  subtransactions?: Array<SaveSubTransaction>
  /**
   * If specified, a new transaction will be assigned this `import_id` and considered "imported".  We will also attempt to match this imported transaction to an existing "user-entered" transaction on the same account, with the same amount, and with a date +/-10 days from the imported transaction date.<br><br>Transactions imported through File Based Import or Direct Import (not through the API) are assigned an import_id in the format: 'YNAB:[milliunit_amount]:[iso_date]:[occurrence]'. For example, a transaction dated 2015-12-30 in the amount of -$294.23 USD would have an import_id of 'YNAB:-294230:2015-12-30:1'.  If a second transaction on the same account was imported and had the same date and same amount, its import_id would be 'YNAB:-294230:2015-12-30:2'.  Using a consistent format will prevent duplicates through Direct Import and File Based Import.<br><br>If import_id is omitted or specified as null, the transaction will be treated as a "user-entered" transaction. As such, it will be eligible to be matched against transactions later being imported (via DI, FBI, or API).
   * @type {string}
   * @memberof NewTransaction
   */
  import_id?: string | null
}
