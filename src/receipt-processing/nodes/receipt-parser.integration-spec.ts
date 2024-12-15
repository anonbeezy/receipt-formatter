import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptParserNode } from 'src/receipt-processing/nodes/receipt-parser';
import { CacheModule } from '@nestjs/cache-manager';
import { ReceiptProcessingState } from '../state';
import { ConfigModule, ConfigService } from '@nestjs/config';
import openaiConfig from 'src/config/openai.config';
import ynabConfig from 'src/config/ynab.config';
import { RedisCache, redisStore } from 'cache-manager-redis-yet';
import redisConfig from 'src/config/redis.config';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ReceiptParserNode (integration)', () => {
  let receiptParserNode: ReceiptParserNode;
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
        OpenAiModule,
      ],
      providers: [ReceiptParserNode],
    }).compile();

    cacheService = module.get<RedisCache>(CACHE_MANAGER);
    receiptParserNode = module.get(ReceiptParserNode);
  });

  afterAll(async () => {
    await cacheService.store.client.disconnect();
    await module.close();
  });

  describe('invoke', () => {
    it.skip('should parse the receipt', async () => {
      const receipt = `
STORES
SPECIALISTS,
SM MALL OF ASIA
OWNED AND OPERATED BY
STORES SPECIALISTS, INC.
GF JW DIOKNO BLVD MOA COMPLEX
STORES SPECIALISTS, INC.
Midland Buendia Building
403 Sen Gil Puyat Ave
Makati City Metro Manila 1200
VAT REGISTERED TIN 000-146-305-00806
MIN 24071817551165347
SN PF4WSQ34
SALES INVOICE
INVOICE NO.: 1-100136686 13/12/2024 19:27:21
COUNTER: 2
CASHIER:
CUSTOMER ID WALKIN
NAME
WALK-IN
CUSTOMER ADDRESS
42130
CUSTOMER TIN
BUSINESS STYLE:
ITEM
1000119352
QTY
PRICE
AMOUNT
PHP
PHP
30.00
30.00
1000119352/TISSUES 10 PCS 1 PACK JUMPING
1000084923
1
180.00
180.00
200030416851/HAT SANTA VELOUR RED
GROSS TOTAL:
210.00
NET TOTAL:
210.00
VATABLE SALE
187.50
VAT
22.50
VAT EXEMPT SALE
0.00
ZERO-RATED SALE:
0.00
CASH
220.00
TOTAL RECEIVED AMOUNT
220.00
CHANGE DUE
10.00
TOTAL ITEMS
2
TOTAL QTY:
2
SALES PERSON:
42130
"THANK YOU FOR SHOPPING!
This serves as your SALES INVOICE"
-210710013668624
SUPPLIER NAME: Synch Enterprises
REGISTER NAME. Synch Enterprises
SUPPLIER ADDRESS 21A Augustus St Garden
Homes BF R Talon DOS NCR, Fourth Dis
VAT REG TIN 419-456-204-000
ACCRED NO 53A4194562042020071326
SUPPLIER DATE OF ISSUE 19072024
SUPPLIER VALID UNTIL DATE:19072029
PTU NUMBER FP072024-116-0458249-00806
Please bring this receipt if you wish to exchange this
item subject to the acceptance policy of the company (at
the back)
`;
      const result = await receiptParserNode.invoke({
        receipt,
      } as typeof ReceiptProcessingState.State);

      console.log(result);
    });

    it.skip('should parse the receipt', async () => {
      const receipt = `
S&R
S&R MEMBERSHIP SHOPPING
Duned & Operated lay Kareila Ment. Corp
Brado Avenue Aseana Business Park
Brgy Bala Paranjue City
Tel No 8853-99991
POS Serial LXFCO
Tin
246-969 491-005-VAT
BIR-ACC 0-40 007242095-000393
NAME
MEMBER
A Joy Aud. for Tano.
003355870000
PHP
110599 CS CELING BRUOM
229.00 V
229.00
23339
SBT 2P 400S 20P
461.00 V
693.00
1 060 139 95
1548
138821
103986 SENSODYNI FRSH3PK
149515 LIBERTY LNR 2201
104011 DOMEX PRU TRC 900
104011 ONE PRO TBC 900
BUY 2 AVE 201
5945
ON ONWHITECAL/KG
148.35 E
MM OF CLOGGER 500ML
129.00 V
261.00 V
279.00 V
149.00 V
149.00
V
COUHLADLCTSETRE 11
130975 QUANTA BINIS 3146
96931 CALBINEYO R3400
143404 FUAZ UUHEAT 5100
20.00-
119.00 V
249 00
229.00 V
117.00 V
V
15850
22853
KIPPY CHUNKY 4802
498.00 V
CHEESY ENSYHDA 6CT
285.00 V
12561
SB ESYCLN SPHGE3S
114.00 V
121705 CB ROAST BLMON1806
138510 HV ZIP GAL 605
138508 HV ZIP QTR 100S
169.00 V
299.00 V
234.00
E
56441
125164
MerboNougat iiCkie
58R KI 140SHI 48OL
129.00 V
379.00 V
SUBTOTAL
ass mount
TOTAL
CASH
4.609.35
4,609.36
4.609.35
4.610.00
0.65
CHANGE DUE
QTY PURCHASED
TOTAL DIRECT ISC 20 00
NO. OF DISC INNES: 1
Tax Code RATE
V
12
382 35
3,774 11
TAX ant
0.00
152.89
01686856
Cashier Edelyn Irabado
Sales Invoice 01256748
Name:
Address
TIN
Business Type
THE WORLD CLASS SHOPPING EXPERIENCE
For RETURN & EXCHIGE, items must
be returned thin 7 days
from date of purchase
NO RECEIPT, NO RETURN
THIS SERVES AS YOUR SALES INVOICE
V-Vatable, E-Vat Expt, 2-Zero Rated
THANK YOU!!!
Vincor Nixdorf(Philippines), Inc
24th Flr Trident Tower
312 Sen Pal Ave, Makati City
BIR cc 019 007242095 000393 26241
Effective Date: August 1, 2020
Valid this July 31, 2025
GET UNLIMITED 3% REBATES
ON YOUR NEXT SER PURCHASE
WITH THE NEW
UNIONBANK S&R CARD
APPLY NOW!!!
St 205 Rule Ch 1003 Tr 86866
20 54 24/12/12
`;
      const result = await receiptParserNode.invoke({
        receipt,
      } as typeof ReceiptProcessingState.State);

      console.log(result);
    });

    it('should parse the receipt', async () => {
      const receipt = `
Uncle John's
ROBINSON'S SUPERMARKET CORPORATION
VAT REG TIN 000-405-340-00763
J122 124 BLDG D PEARL DRIVE CORNER
SUNRISE DRIVE SM MOA COMPLEX BRGY. 76
PASAY CITY NCR 1300
Name:
TIN:
Address:
Business Style:.
OIS RIDGE ONI60G
48.00 V
00000000164191
TOTAL
P48.00
CASH
P10
Change
P52.00
*****:
Vatable
42.86
VAT Exempt Sales
0.00
Zero Rated Sales
0.00
VAT
5.14
Total
48.00
*****
Total Items: 1
Cashier: 6001 Ella Mae Besa
Str No: 3008 Date: 12/11/2024 Time:20:50:57
Terminal No: 0002
Trans ID: 7094
This serves as your Sales Invoice
SI No: 0000171227
Robinsons Supermarket Corporation
110 E. Rodriguez Jr. Ave., Bagumbayan QC
ACCDTN NO.: 116-000405340-000340-57230
Issued 08/29/12, Effective 08/01/20
TIN: 000-405-340-000
SN: 59GN921762C
PN: FP062023-116-0389198-00763
MIN: 23061510445487890
SPM: SP062023-116-0122139-00763
`;
      const result = await receiptParserNode.invoke({
        receipt,
      } as typeof ReceiptProcessingState.State);

      console.log(result);
    });

    it.skip('should parse the receipt', async () => {
      const receipt = `
J013202
Alfamart
ALFAMEIRO MARKETING. INC.
ALFAMART, UNIT 101-104 SEA RES
PEARL DRIVE COR SUNRISE DRIVE
VAT-REG TIN 008-720-052-083
MIN 22081414115811720
SN# XTL20383
THIS SERVES AS YOUR SALES INVOICE
TISYUBTMS3PY333PL 18
41.00
TOTAL
41.00
CASH
50.00
Change
8.00
ITEM/S PURCHASED : 1
Vatable Sale
38.81
VAT (12%)
4.38
Vat Exempt Sale
0.00
Zero Rated Sale
0.00
Customer Name :
Customer Tin No. :
ANH
9001
Customer Address:
Business Style, if any :
ALFAMETRO MARKETING. INC.
SM Corporate Bldg. E JW Diokno
Blvd. MDA Complex Pasay City
VAT-REG TIN# 008-720-052-000
ACCREDTN # 051-008720052-000878-73010
DateIssued08/01/2020
BIR PERMIT # FP082022-118-0333288-00083
For exchange, std provisions on consumer
protection & product warranty will apply
SI #:842018 28-11-2024 18:43
A: 1707 B:01 C:50188554 D:857788
1/1
Rit 1
`;
      const result = await receiptParserNode.invoke({
        receipt,
      } as typeof ReceiptProcessingState.State);

      console.log(result);
    });
  });
});
