import { Module } from '@nestjs/common';
import { YnabModule } from 'src/ynab/ynab.module';
import { PayeesService } from './payees.service';
import { PayeesGraph } from './payees.graph';
import { TransformNode } from './nodes/transform';
import { FormatNode } from './nodes/format';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  imports: [YnabModule, OpenAiModule],
  providers: [PayeesService, PayeesGraph, TransformNode, FormatNode],
  exports: [PayeesGraph],
})
export class PayeesModule {}
