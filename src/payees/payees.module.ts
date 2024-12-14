import { Module } from '@nestjs/common';
import { YnabModule } from 'src/ynab/ynab.module';
import { PayeesService } from './payees.service';
import { PayeesGraph } from './payees.graph';
import { MatchPayeeNode } from './nodes/match-payee';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  imports: [YnabModule, OpenAiModule],
  providers: [PayeesService, PayeesGraph, MatchPayeeNode],
  exports: [PayeesGraph],
})
export class PayeesModule {}
