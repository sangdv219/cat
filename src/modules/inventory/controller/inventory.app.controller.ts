import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@shared/dto/common';
import { GetAllInventoryResponseDto, GetByIdInventoryResponseDto } from '@modules/inventory/dto/inventory.response.dto';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { CacheTTL } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Query,
  UseFilters,
  UseInterceptors
} from '@nestjs/common';
import { Ctx, EventPattern, Payload, TcpContext } from '@nestjs/microservices';
import { EVENT } from 'libs/common/src/constants/event';

@Controller({ path: 'app/inventory', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class InventoryAppController {
  private readonly logger = new Logger(InventoryAppController.name);
  constructor(private readonly inventoryService: InventoryService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  @EventPattern(EVENT.ORDER_CREATED_EVENT)
  // async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllInventoryResponseDto> {
  async getPagination(@Payload() @Query() query: PaginationQueryDto, @Ctx() context: TcpContext): Promise<GetAllInventoryResponseDto> {
    this.logger.log(`[GATEWAY] Response from Inventory Service: ${JSON.stringify(query)}`);
    // this.logger.log(`[GATEWAY] context: ${JSON.stringify(context)}`);
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
