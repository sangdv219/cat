import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { AuditLogModel } from './audit_logs.model';

@Module({
  imports: [
    SequelizeModule.forFeature([AuditLogModel]),
  ],
})
export class AuditModule {}
