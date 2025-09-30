import { BaseModel } from '@shared/model/base.model';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Sequelize,
  Table
} from 'sequelize-typescript';

@Table({
  tableName: 'audit_logs',
  timestamps: true,
  underscored: true,
})
export class AuditLogModel extends BaseModel<AuditLogModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare table_name: string;

  @AllowNull(true)
  @Column({ type: DataType.UUID })
  declare record_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(20) })
  declare action: string;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  declare old_data: any;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  declare new_data: any;
}
