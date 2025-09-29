// base.model.ts
import { Model, Column, DataType, BeforeCreate, BeforeUpdate, AllowNull, Default, CreatedAt, UpdatedAt, AfterCreate, AfterDestroy, AfterUpdate, AfterBulkDestroy } from 'sequelize-typescript';
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
    static async setCreatedBy(instance: BaseModel<any>) {
        const userId = ClsServiceManager.getClsService().get('userId');
        if (userId) {
            instance.created_by = userId;
        }
    }

    @BeforeUpdate
    static async setUpdatedBy(instance: BaseModel<any>) {
        const userId = ClsServiceManager.getClsService().get('userId');
        if (userId) {
            instance.updated_by = userId;
        }
    }


    @AfterCreate
    static async logCreate(instance: BaseModel<any>, options: any) {
        const tableName = (instance.constructor as typeof Model).tableName;
        const primaryKey = (instance.constructor as typeof Model).primaryKeyAttribute;
        const recordId = (instance as any).get(primaryKey);
        const { AuditLogModel } = require('../../audit/audit_logs.model');
        const modelClass = instance.constructor as typeof Model;
        if (modelClass.tableName === 'audit_logs') {
            return;
        }
        await AuditLogModel.create({
            table_name: tableName,
            record_id: recordId,
            action: 'CREATE',
            old_data: instance.toJSON(),
            new_data: instance.toJSON(),
        } as typeof AuditLogModel);
    }

    @AfterUpdate
    static async logUpdate(instance: BaseModel<any>, options: any) {
        const tableName = (instance.constructor as typeof Model).tableName;
        const primaryKey = (instance.constructor as typeof Model).primaryKeyAttribute;
        const recordId = (instance as any).get(primaryKey);
            const { AuditLogModel } = require('../../audit/audit_logs.model');
            await AuditLogModel.create({
                table_name: tableName,
                record_id: recordId,
                action: 'UPDATE',
                old_data: instance.toJSON(),
                new_data: instance.toJSON(),
            } as typeof AuditLogModel);
    }

    @AfterBulkDestroy
    static async logDelete(instance: BaseModel<any>, options: any) {
        const tableName = (instance.constructor as typeof Model).tableName;
        const primaryKey = (instance.constructor as typeof Model).primaryKeyAttribute;
        const recordId = (instance as any).get(primaryKey);
        const { AuditLogModel } = require('../../audit/audit_logs.model');
        await AuditLogModel.create({
            table_name: tableName,
            record_id: recordId,
            action: 'DELETE',
            old_data: instance.toJSON(),
            new_data: instance.toJSON(),
        } as typeof AuditLogModel);
    }
}
