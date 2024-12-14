import { Test, TestingModule } from '@nestjs/testing';
import { MatchPayeeNode } from 'src/payees/nodes/match-payee';
import { PayeesService } from '../payees.service';
import { CacheModule } from '@nestjs/cache-manager';
import { PayeesState } from '../state';
import { ConfigModule, ConfigService } from '@nestjs/config';
import openaiConfig from 'src/config/openai.config';
import ynabConfig from 'src/config/ynab.config';
import { RedisCache, redisStore } from 'cache-manager-redis-yet';
import redisConfig from 'src/config/redis.config';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { YnabModule } from 'src/ynab/ynab.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('MatchPayeeNode (integration)', () => {
  let matchPayeeNode: MatchPayeeNode;
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
      providers: [PayeesService, MatchPayeeNode],
    }).compile();

    cacheService = module.get<RedisCache>(CACHE_MANAGER);
    matchPayeeNode = module.get(MatchPayeeNode);
  });

  afterAll(async () => {
    await cacheService.store.client.disconnect();
    await module.close();
  });

  describe('run', () => {
    it('should match the payee name', async () => {
      const payeeName = 'STORES SPECIALISTS';
      const result = await matchPayeeNode.invoke({
        payeeName,
      } as typeof PayeesState.State);

      expect(result.payee).toMatchObject({
        id: null,
        name: null,
        confidence: expect.any(Number),
        thinking: expect.any(String),
        reason: expect.any(String),
      });
      expect(result.payee.confidence).toBeLessThan(0.7);
    });
    it.skip('should match the payee name', async () => {
      const payeeName = 'alfamar';
      const result = await matchPayeeNode.invoke({
        payeeName,
      } as typeof PayeesState.State);

      expect(result.payee).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        confidence: expect.any(Number),
        thinking: expect.any(String),
        reason: expect.any(String),
      });
      expect(result.payee.confidence).toBeGreaterThanOrEqual(0.8);
    });
  });
});
