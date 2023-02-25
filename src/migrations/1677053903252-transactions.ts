import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class transactions1677053903252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction_records',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'user_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'target_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'call_data',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: 0,
          },
          {
            name: 'tx_hash',
            type: 'varchar',
            default: null,
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndices('transaction_records', [
      new TableIndex({
        columnNames: ['status'],
        isUnique: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transaction_records');
  }
}
