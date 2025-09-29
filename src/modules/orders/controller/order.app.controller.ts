import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { CreatedOrderItemRequestDto, CreatedOrderRequestDto, UpdatedOrderRequestDto } from '@/modules/orders/dto/order.request.dto';
import { CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAllOrderResponseDto, GetByIdOrderResponseDto } from '../dto/order.response.dto';
import { OrderService } from '../services/order.service';

@ApiBearerAuth('Authorization')
@Controller({ path:'app/orders', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class OrderAppController {
  constructor(
    private readonly orderService: OrderService
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllOrderResponseDto> {
    try {
      return await this.orderService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<GetByIdOrderResponseDto | null> {
    try {
      return await this.orderService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // @HttpCode(HttpStatus.CREATED)
  @Post('checkout')
  async checkout(@Body() createOrderDto: CreatedOrderRequestDto) {
    try {
      return await this.orderService.checkout(createOrderDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOrder(@Param('id') id: string, @Body() dto: UpdatedOrderRequestDto) {
    try {
      return await this.orderService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(@Param('id') id: string): Promise<void> {
    try {
      return await this.orderService.delete(id);
    } catch (error) {
      throw error;
    }
  }

}
