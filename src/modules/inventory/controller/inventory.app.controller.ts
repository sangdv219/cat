import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
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
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PaginationQueryDto } from '@shared/dto/common';
import { EVENT } from 'libs/common/src/constants/event';
import { RmqService } from 'libs/common/src/rabbitMQ/rmb.service';

@Controller({ path: 'app/inventory', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class InventoryAppController {
  private readonly logger = new Logger(InventoryAppController.name);
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rmqService: RmqService
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  // @EventPattern(EVENT.ORDER_CREATED_EVENT)
  // async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllInventoryResponseDto> {
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllInventoryResponseDto> {
    this.logger.log(`[GATEWAY] Response from Inventory Service: ${JSON.stringify(query)}`);
    // this.logger.log(`[GATEWAY] context: ${JSON.stringify(context)}`);
    // const channel = context.getChannelRef();   // 🧠 Truy cập channel của RabbitMQ
    // const message = context.getMessage();      // 📨 Thông tin message gốc
    // const pattern = context.getPattern();      // 📡 Tên event/pattern
    try {
      const result = await this.inventoryService.getPagination(query);
      // ✅ Xác nhận thành công
      // this.rmqService.ack(context);  // confirm processed done to remove message from queue
      return result;
    } catch (error) {
      Logger.log('error:', error);
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
