import { EntityRepository, Repository } from 'typeorm';
import { TransactionRecordsEntity } from '../entities/transaction-records.entity';
@EntityRepository(TransactionRecordsEntity)
export class TransactionRecordsRepository extends Repository<TransactionRecordsEntity> {}
