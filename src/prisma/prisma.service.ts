import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Initializing database connection...');
    
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('✅ Successfully connected to the Render PostgreSQL database.');
        break;
      } catch (err) {
        this.logger.error(`❌ Database connection failed. Retries left: ${retries - 1}`);
        this.logger.error(`Reason: ${err.message}`);
        
        if (err.message.includes('SSL')) {
          this.logger.warn('TIP: For Render PostgreSQL, ensure your DATABASE_URL in the dashboard ends with "?sslmode=no-verify" or "?sslmode=require".');
        }

        retries -= 1;
        if (retries === 0) {
          this.logger.error('CRITICAL: Could not connect to the database. Application will likely fail.');
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
