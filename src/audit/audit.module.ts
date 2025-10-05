import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLogModel } from '@audit/audit_logs.model';

@Module({
  imports: [SequelizeModule.forFeature([AuditLogModel])],
  exports: [SequelizeModule.forFeature([AuditLogModel])],
})
export class AuditModule {}
