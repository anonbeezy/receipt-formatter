import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesGraph } from './categories/categories.graph';
import { PayeesGraph } from './payees/payees.graph';
import { ReceiptProcessingGraph } from './receipt-processing/receipt-processing.graph';
import { TransactionsGraph } from './transactions/transactions.graph';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        CategoriesGraph,
        PayeesGraph,
        ReceiptProcessingGraph,
        TransactionsGraph,
      ],
    })
      .overrideProvider(CategoriesGraph)
      .useValue({
        compile: jest.fn().mockReturnValue({
          run: jest.fn(),
        }),
      })
      .overrideProvider(PayeesGraph)
      .useValue({
        compile: jest.fn().mockReturnValue({
          run: jest.fn(),
        }),
      })
      .overrideProvider(ReceiptProcessingGraph)
      .useValue({
        compile: jest.fn().mockReturnValue({
          run: jest.fn(),
        }),
      })
      .overrideProvider(TransactionsGraph)
      .useValue({
        compile: jest.fn().mockReturnValue({
          run: jest.fn(),
        }),
      })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
