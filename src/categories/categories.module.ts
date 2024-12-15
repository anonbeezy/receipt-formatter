import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { YnabModule } from '../ynab/ynab.module';
import { FormatNode } from './nodes/format';
import { MatchCategoryNode } from './nodes/transform';
import { CategoriesGraph } from './categories.graph';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  imports: [YnabModule, OpenAiModule],
  providers: [
    CategoriesService,
    CategoriesGraph,
    MatchCategoryNode,
    FormatNode,
  ],
  exports: [CategoriesGraph],
})
export class CategoriesModule {}
