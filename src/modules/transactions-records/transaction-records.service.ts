import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRecordsRepository } from '../../models/repositories/transaction-records.repository';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { TransactionRecordsEntity } from '../../models/entities/transaction-records.entity';
import { TransactionRecordsHelper } from './helper/transaction-records.helper';
import { TransactionRecordStatus } from './constants/constants';
import { ChainInfoRepository } from '../../models/repositories/chain-info.repository';
import { ChainInfoEntity } from 'src/models/entities/chain-info.entity';
import { getConfig } from '../../configs';

@Injectable()
export class TransactionRecordsService {
  constructor(
    @InjectRepository(TransactionRecordsRepository)
    private transactionRecord: TransactionRecordsRepository,
    private chainInfo: ChainInfoRepository,
  ) {}
  async createTransactionRecords(
    createTransactionRecords: CreateTransactionRecordDto[],
  ): Promise<TransactionRecordsEntity[]> {
    const records = [];
    const prefix = getConfig().get<string>('prefixMessage');
    for (let i = 0; i < createTransactionRecords.length; i++) {
      const item = createTransactionRecords[i];
      const isValid = TransactionRecordsHelper.checkRecoverSameAddress(
        item.userAddress,
        item.signature,
        prefix + item.callData,
      );
      if (isValid) {
        records.push({
          userAddress: item.userAddress,
          callData: item.callData,
          targetAddress: item.targetAddress,
          status: TransactionRecordStatus.PENDING,
        });
      }
    }
    console.log(records);
    return this.transactionRecord.save(records);
  }

  async getTransactionRecords(
    amount: number,
  ): Promise<TransactionRecordsEntity[]> {
    return this.transactionRecord.find({
      where: {
        status: TransactionRecordStatus.PENDING,
      },
      order: {
        id: 'ASC',
      },
      take: amount,
    });
  }

  async getNonce(): Promise<number> {
    const key = await TransactionRecordsHelper.getNonceKey();
    const item = await this.chainInfo.findOne({
      where: {
        key,
      },
    });
    return item ? +item.value : 0;
  }

  async updateNonce(nonce: number): Promise<void> {
    const key = await TransactionRecordsHelper.getNonceKey();
    let item = await this.chainInfo.findOne({
      where: {
        key,
      },
    });
    if (!item) {
      item = new ChainInfoEntity();
      item.key = key;
    }
    item.value = nonce.toString();
    await this.chainInfo.save(item);
  }

  async updateListTx(
    listId: number[],
    status: string,
    txHash: string,
  ): Promise<void> {
    const queryBuilder = this.transactionRecord
      .createQueryBuilder()
      .where('id IN (:listId)', { listId })
      .update(TransactionRecordsEntity)
      .set({
        status,
        txHash,
      });
    await queryBuilder.execute();
  }
}
