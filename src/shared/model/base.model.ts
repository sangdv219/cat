// base.model.ts
import { Model, Column, DataType, BeforeCreate, BeforeUpdate, AllowNull, Default, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { ClsServiceManager } from 'nestjs-cls';
export abstract class BaseModel<T extends {}> extends Model<T> {
    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare created_by: string;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare updated_by: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    declare created_at: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updated_at: Date;
    
    @BeforeCreate
    static setCreatedBy(instance: BaseModel<any>) {
        const userId = ClsServiceManager.getClsService().get('userId');
        if (userId) {
            instance.created_by = userId;
            instance.updated_by = userId;
        }
    }

    @BeforeUpdate
    static setUpdatedBy(instance: BaseModel<any>) {
        const userId = ClsServiceManager.getClsService().get('userId');
        if (userId) {
            instance.created_by = userId;
            instance.updated_by = userId;
        }
    }
}
