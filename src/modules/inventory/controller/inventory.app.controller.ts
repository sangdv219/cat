import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { GetAllInventoryResponseDto, GetByIdInventoryResponseDto } from '@modules/inventory/dto/inventory.response.dto';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { CacheTTL } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseFilters,
  UseInterceptors
} from '@nestjs/common';

@Controller('app/inventory')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class InventoryAppController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllInventoryResponseDto> {
    try {
      return await this.inventoryService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getInventoryById(@Param('id') id: string): Promise<GetByIdInventoryResponseDto | null> {
    try {
      return await this.inventoryService.getByProductId('id', id);
    } catch (error) {
      throw error;
    }
  }

  @Get('/product/:id')
  async getByProductId(@Param('id') product_id: string): Promise<GetByIdInventoryResponseDto | null> {
    try {
      return await this.inventoryService.getByProductId('product_id', product_id);
    } catch (error) {
      throw error;
    }
  }
}
