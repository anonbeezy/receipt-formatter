import { Test } from '@nestjs/testing';

import { TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../transactions.service';
import { CreateTransactionNode } from './create-transaction';

describe('CreateTransactionNode', () => {
  let node: CreateTransactionNode;
  let transactionsService: jest.Mocked<TransactionsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionNode,
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    node = module.get<CreateTransactionNode>(CreateTransactionNode);
    transactionsService = module.get(TransactionsService);
  });

  it('should create a transaction', async () => {
    const state = {
      extractedTransaction: {
        date: '2024-12-11',
        amount: -48000,
        payeeName: "Robinson's Supermarket Corporation",
        categoryName: 'Groceries',
        memo: 'Grocery shopping',
      },
      extractedLineItems: [
        {
          name: 'OIS RIDGE ONI60G',
          quantity: 1,
          price: -48000,
        },
      ],
      extractedStore: {
        name: "Robinson's Supermarket Corporation",
        address:
          'J122 124 BLDG D PEARL DRIVE CORNER SUNRISE DRIVE SM MOA COMPLEX BRGY. 76 PASAY CITY NCR 1300',
        phone: null,
        website: null,
        taxId: '000-405-340-00763',
      },
      payee: {
        id: 'c37b17d8-f16d-44b5-8752-67f22eb9f02f',
        name: 'Alfamart',
        confidence: 0.9,
      },
      category: {
        id: 'be1d7f68-e26f-440d-8d59-181e9eae7220',
        name: 'Groceries',
        confidence: 1,
      },
      transaction: null,
      apiResponse: null,
    };

    const mockTransaction = {
      date: new Date(state.extractedTransaction.date).toISOString(),
      amount: -48000,
      payeeId: 'c37b17d8-f16d-44b5-8752-67f22eb9f02f',
      payeeName: null,
      categoryId: 'be1d7f68-e26f-440d-8d59-181e9eae7220',
    };

    transactionsService.create.mockResolvedValue(true as any);

    const result = await node.run(state);

    expect(transactionsService.create).toHaveBeenCalledWith(mockTransaction);
    expect(result).toEqual({ apiResponse: true });
  });

  it('populates payee from extracted store when payee is not found', async () => {
    const state = {
      extractedTransaction: {
        date: '2024-12-15',
        amount: -4609350,
        payeeName: null,
        categoryName: null,
        memo: null,
        confidence: 100,
        thinking:
          'The total amount spent during the shopping transaction corresponds to the total noted after the product listings.',
        reason: 'Total purchase amount recorded on the receipt.',
      },
      extractedLineItems: [
        {
          name: 'CS Ceiling',
          quantity: 1,
          price: -229000,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'SBT 2P 400S 20P',
          quantity: 1,
          price: -461000,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'SENSODYNE Fresh 3PK',
          quantity: 1,
          price: -149900,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'LIBERTY LNR 2201',
          quantity: 1,
          price: -149900,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'DOMEX PRU TRC 900',
          quantity: 1,
          price: -149900,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'ONE PRO TBC 900',
          quantity: 1,
          price: -149900,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'MM of Clogger 500ML',
          quantity: 1,
          price: -261000,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'KIPPY CHUNKY 4802',
          quantity: 1,
          price: -498000,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'CHEESY ENSYHDA 6CT',
          quantity: 1,
          price: -285000,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
        {
          name: 'MerboNougat iiCkie',
          quantity: 1,
          price: -379000,
          confidence: 100,
          thinking:
            'Identified as a product based on its pricing and context within a grocery shopping environment.',
          reason: 'Product listed on the receipt.',
        },
      ],
      extractedStore: {
        name: 'S&R Membership Shopping',
        address: 'Brado Avenue Aseana Business Park, Brgy Bala, Paranjue City',
        phone: '8853-99991',
        website: null,
        taxId: '246-969 491-005-VAT',
        confidence: 100,
        thinking:
          'Identified as the store name from the receipt header and transaction details.',
        reason: 'Business type identified on the receipt.',
      },
      payee: {
        id: null,
        name: null,
        confidence: 0.4,
        thinking: 'Only matches store category',
        reason: 'No specific name match',
      },
      category: null,
      transaction: null,
      apiResponse: null,
    };

    const mockTransaction = {
      date: new Date(state.extractedTransaction.date).toISOString(),
      amount: -4609350,
      payeeId: null,
      payeeName: 'S&R Membership Shopping',
      categoryId: null,
    };

    transactionsService.create.mockResolvedValue(true as any);

    const result = await node.run(state);

    expect(transactionsService.create).toHaveBeenCalledWith(mockTransaction);
    expect(result).toEqual({ apiResponse: true });
  });
});
