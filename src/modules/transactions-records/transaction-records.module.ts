import { Module } from '@nestjs/common';
import { TransactionRecordsController } from './transaction-records.controller';
import { TransactionRecordsService } from './transaction-records.service';
import { DatabaseCommonModule } from '../../models/database-common.module';
import { TransactionRecordsConsole } from './transaction-records.console';

@Module({
  imports: [DatabaseCommonModule],
  controllers: [TransactionRecordsController],
  providers: [TransactionRecordsService, TransactionRecordsConsole],
  exports: [TransactionRecordsService],
})
export class TransactionRecordsModule {}
