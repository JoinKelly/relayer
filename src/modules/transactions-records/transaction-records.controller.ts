import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionRecordsService } from './transaction-records.service';
import { TransactionRecordsEntity } from '../../models/entities/transaction-records.entity';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';

@ApiTags('transaction-records')
@Controller('transaction-records')
export class TransactionRecordsController {
  constructor(private transactionRecordsService: TransactionRecordsService) {}
  @Post('/')
  @ApiOperation({
    description: 'Add new transaction record',
    summary: 'Add new transaction record',
  })
  @ApiBody({
    type: CreateTransactionRecordDto,
    isArray: true,
  })
  async createTransactionRecord(
    @Body() transactionRecord: CreateTransactionRecordDto[],
  ): Promise<TransactionRecordsEntity[]> {
    return this.transactionRecordsService.createTransactionRecords(
      transactionRecord,
    );
  }
}
