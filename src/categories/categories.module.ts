import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { YnabModule } from '../ynab/ynab.module';
import { MatchCategoryNode } from './nodes/match-category';
import { CategoriesGraph } from './categories.graph';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  imports: [YnabModule, OpenAiModule],
  providers: [CategoriesService, CategoriesGraph, MatchCategoryNode],
  exports: [CategoriesGraph],
})
export class CategoriesModule {}
