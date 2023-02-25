import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionRecordDto {
  @ApiProperty({
    required: true,
  })
  userAddress: string;

  @ApiProperty({
    required: true,
  })
  targetAddress: string;

  @ApiProperty({
    required: true,
  })
  signature: string;

  @ApiProperty({
    required: true,
  })
  callData: string;
}
