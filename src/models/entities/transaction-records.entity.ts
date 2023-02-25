import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transaction_records')
export class TransactionRecordsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'user_address', nullable: false })
  public userAddress: string;

  @Column({ name: 'target_address', nullable: false })
  public targetAddress: string;

  @Column({ name: 'call_data', nullable: false })
  public callData: string;

  @Column({ name: 'tx_hash', nullable: false })
  public txHash: string;

  @Column({ name: 'status', nullable: false })
  public status: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: number;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: number;
}
