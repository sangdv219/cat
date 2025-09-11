import {
  Column,
  Model,
  Table,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  DataType,
  IsUUID,
  AutoIncrement,
  ForeignKey,
} from 'sequelize-typescript';
import { UserModel } from '@/modules/users/domain/models/user.model';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class UserAuthModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  user_id: string;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING(500) })
  email: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  password_hash: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(100) })
  provider: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255) })
  provider_user_id: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  last_login_at: Date;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at: Date;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updated_at: Date;
}
