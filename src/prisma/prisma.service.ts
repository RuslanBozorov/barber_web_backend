import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('Successfully connected to the database.');
        break;
      } catch (err) {
        this.logger.error(`Database connection failed. Retries left: ${retries - 1}`, err);
        retries -= 1;
        if (retries === 0) {
          this.logger.error('Could not connect to the database after multiple retries.');
          throw err;
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
