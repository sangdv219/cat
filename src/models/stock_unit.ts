import { Column, Model, Table, PrimaryKey, Default, AllowNull, Unique, DataType, IsUUID, AutoIncrement } from 'sequelize-typescript';

@Table({
    tableName: 'stock_unit',
    timestamps: true,
    underscored: true,
})
export class StockUnitModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUIDV4)
    declare id: string;

    @AllowNull(true)
    @Default('')
    @Column({ type: DataType.STRING(500) })
    name: string;

    @AllowNull(false)
    @Column({ type: DataType.NUMBER })
    ratio: string;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    is_base: boolean;

    @AllowNull(true)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    created_at: Date;

    @AllowNull(true)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updated_at: Date;
}
