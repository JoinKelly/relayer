import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRecordsRepository } from './repositories/transaction-records.repository';
import { ChainInfoRepository } from './repositories/chain-info.repository';

const commonRepositories = [TransactionRecordsRepository, ChainInfoRepository];

@Module({
  imports: [TypeOrmModule.forFeature(commonRepositories)],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
