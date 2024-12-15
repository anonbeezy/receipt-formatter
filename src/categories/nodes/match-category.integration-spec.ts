import { Test, TestingModule } from '@nestjs/testing';
import { MatchCategoryNode } from 'src/categories/nodes/match-category';
import { CategoriesService } from '../categories.service';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoriesState } from '../state';
import { ConfigModule, ConfigService } from '@nestjs/config';
import openaiConfig from 'src/config/openai.config';
import ynabConfig from 'src/config/ynab.config';
import { RedisCache, redisStore } from 'cache-manager-redis-yet';
import redisConfig from 'src/config/redis.config';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { YnabModule } from 'src/ynab/ynab.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('MatchCategoryNode (integration)', () => {
  let matchCategoryNode: MatchCategoryNode;
  let module: TestingModule;
  let cacheService: RedisCache;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [openaiConfig, ynabConfig, redisConfig],
          envFilePath: '.env.test',
        }),
        CacheModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            store: await redisStore({
              url: configService.get('redis.url'),
            }),
          }),
          inject: [ConfigService],
          isGlobal: true,
        }),
        YnabModule,
        OpenAiModule,
      ],
      providers: [CategoriesService, MatchCategoryNode],
    }).compile();

    cacheService = module.get<RedisCache>(CACHE_MANAGER);
    matchCategoryNode = module.get(MatchCategoryNode);
  });

  afterAll(async () => {
    await cacheService.store.client.disconnect();
    await module.close();
  });

  describe('invoke', () => {
    it.skip('should not match the category name', async () => {
      const categoryName = 'STORES SPECIALISTS';
      const result = await matchCategoryNode.invoke({
        categoryName,
      } as typeof CategoriesState.State);

      expect(result.category).toMatchObject({
        id: null,
        name: null,
        confidence: expect.any(Number),
        thinking: expect.any(String),
        reason: expect.any(String),
      });
      expect(result.category.confidence).toBeLessThan(0.7);
    });

    it.skip('should match the category name', async () => {
      const categoryName = 'Restaurant';
      const result = await matchCategoryNode.invoke({
        categoryName,
      } as typeof CategoriesState.State);

      console.log(result.category);

      expect(result.category).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        confidence: expect.any(Number),
        thinking: expect.any(String),
        reason: expect.any(String),
      });
      expect(result.category.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it('should match the category name', async () => {
      const categoryName = 'Entertainment';
      const result = await matchCategoryNode.invoke({
        categoryName,
      } as typeof CategoriesState.State);

      console.log(result.category);

      expect(result.category).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        confidence: expect.any(Number),
        thinking: expect.any(String),
        reason: expect.any(String),
      });
      expect(result.category.confidence).toBeGreaterThanOrEqual(0.7);
    });
  });
});
