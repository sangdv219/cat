import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { InventoryModel } from './domain/models/inventory.model';
import { PostgresInventoryRepository } from './infrastructure/repository/postgres-inventory.repository';
import { InventoryService } from './services/inventory.service';
import { InventoryAppController } from './controller/inventory.app.controller';
import { InventoryAdminController } from './controller/inventory.admin.controller';
import { ProductModule } from '../products/product.module';

config();
@Module({
  imports: [SequelizeModule.forFeature([InventoryModel]), CommonModule, ProductModule ],
  controllers: [InventoryAppController, InventoryAdminController],
  providers: [
    PostgresInventoryRepository,
    InventoryService,
    JwtModule,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'IInventoryCheckerService',
      useClass: InventoryService,
    }
  ],
  exports: [PostgresInventoryRepository, InventoryService, 'IInventoryCheckerService'],
})
export class InventoryModule {}
