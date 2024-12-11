import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { YnabService } from 'src/ynab/ynab.service';
import { Category } from 'ynab';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    private readonly ynabService: YnabService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async findAll() {
    this.logger.log('Finding all categories');
    const cachedCategories =
      await this.cacheService.get<Category[]>('categories');
    if (cachedCategories) {
      this.logger.log('Returning cached categories');
      return cachedCategories;
    }
    const response = await this.ynabService.getCategories();
    const categories = response.data.category_groups
      .flatMap((group) => group.categories)
      .filter((category) => !category.deleted && !category.hidden);

    this.cacheService.set('categories', categories);
    return categories;
  }

  async findAllAsCsv() {
    this.logger.log('Finding all categories as CSV');
    const categories = await this.findAll();
    return (
      'id,name\n' +
      categories.map((category) => `${category.id},${category.name}`).join('\n')
    );
  }
}
