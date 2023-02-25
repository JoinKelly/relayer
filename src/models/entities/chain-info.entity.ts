import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chain_info')
export class ChainInfoEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'key', nullable: false })
  public key: string;

  @Column({ name: 'value', nullable: false })
  public value: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: number;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: number;
}
