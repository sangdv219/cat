import { BaseModel } from '@/shared/model/base.model';
import { ClsServiceManager } from 'nestjs-cls';
import {
  AllowNull,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Sequelize,
  Table,
  Unique
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})

export class UserModel extends BaseModel<UserModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(500) })
  declare name: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare password_hash: string;

  @AllowNull(true)
  @Unique
  @Column({ type: DataType.STRING(500) })
  declare email: string;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.STRING(100) })
  declare phone: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255) })
  declare gender: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare age: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_root: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_active: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare avatar: string;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  declare created_at: Date;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  declare updated_by: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  declare deleted_by: string;

  @BeforeUpdate
  static setDeteledBy(instance: UserModel) {
    const userId = ClsServiceManager.getClsService().get('userId');
    if (userId) {
      instance.deleted_by = userId;
    }
  }

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  declare deleted_at: Date;

  @AllowNull(true)
  @Default(0)
  @Column(DataType.INTEGER)
  declare failed_login_attempts: number;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  declare last_failed_login_at: Date;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  declare locked_until: Date; // New field to track when the account is locked until
}
