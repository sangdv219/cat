import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table({
    tableName: 'users',
    timestamps: true,
    underscored: true,
})
export class UserModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Default('')
    @Column({ type: DataType.STRING(500) })
    name: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    password_hash: string;

    @AllowNull(true)
    @Unique
    @Column({ type: DataType.STRING(500) })
    email: string;

    @AllowNull(false)
    @Default('')
    @Column({ type: DataType.STRING(100) })
    phone: string;

    @AllowNull(true)
    @Column({ type: DataType.STRING(255) })
    gender: string;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    age: number;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_root: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_active: boolean;

    @AllowNull(true)
    @Column(DataType.STRING)
    avatar: string;

    @AllowNull(true)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    created_at: Date;

    @AllowNull(true)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updated_at: Date;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DATE)
    deleted_at: Date;

    @AllowNull(true)
    @Default(0)
    @Column(DataType.INTEGER)
    failed_login_attempts: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DATE)
    last_failed_login_at: Date;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DATE)
    locked_until: Date; // New field to track when the account is locked until
}
