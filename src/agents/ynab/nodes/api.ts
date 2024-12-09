import { YnabState } from '../state';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { YnabService } from '../../../services/ynab.service';

export class ApiNode extends ToolNode {
  constructor(private readonly ynabService: YnabService) {
    super([]);
  }
  async run(state: typeof YnabState.State) {
    console.log('Executing apiNode', JSON.stringify(state, null, 2));

    try {
      const apiResponse = await this.ynabService.createTransaction({
        ...state.ynabTransaction,
        date: state.ynabTransaction.date
          ? new Date(state.ynabTransaction.date).toISOString()
          : new Date().toISOString(),
        amount: state.ynabTransaction.amount,
        payee_id: state.ynabTransaction.payee_id,
        payee_name: state.ynabTransaction.payee_name,
        category_id: state.ynabTransaction.category_id,
      });
      return {
        apiResponse,
      };
    } catch (e) {
      console.log(e);
      return {
        apiResponse: e,
      };
    }
  }
}
