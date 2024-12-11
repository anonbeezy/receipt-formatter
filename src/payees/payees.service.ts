import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { YnabService } from 'src/ynab/ynab.service';
import { Payee } from 'ynab';

@Injectable()
export class PayeesService {
  private readonly logger = new Logger(PayeesService.name);
  constructor(
    private readonly ynabService: YnabService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async findAll() {
    this.logger.log('Finding all payees');
    const cachedPayees = await this.cacheService.get<Payee[]>('payees');
    if (cachedPayees) {
      this.logger.log('Returning cached payees');
      return cachedPayees;
    }
    const response = await this.ynabService.getPayees();
    const payees = response.data.payees.filter((payee) => !payee.deleted);

    this.cacheService.set('payees', payees);
    return payees;
  }

  async findAllAsCsv() {
    this.logger.log('Finding all payees as CSV');
    const payees = await this.findAll();
    return (
      'id,name\n' +
      payees.map((payee) => `${payee.id},${payee.name}`).join('\n')
    );
  }
}
