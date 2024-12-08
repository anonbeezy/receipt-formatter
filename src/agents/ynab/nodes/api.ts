import { YnabState } from '../state';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { YnabService } from '../../../services/ynab.service';

export class ApiNode extends ToolNode {
  constructor(private readonly ynabService: YnabService) {
    super([]);
  }
  async run(state: typeof YnabState.State) {
    console.log('Executing apiNode');

    const apiResponse = await this.ynabService.createTransaction(
      state.ynabTransaction,
    );

    return {
      apiResponse,
    };
  }
}
