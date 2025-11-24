import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@shared/dto/common';
import { ProductService } from '@modules/products/services/product.service';
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
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAllProductResponseDto, GetByIdProductResponseDto } from '@modules/products/dto/product.response.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CMD } from 'libs/common/src/constants/event';

@ApiBearerAuth('Authorization')
@Controller({ path: 'app/products', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class ProductAppController {
  constructor(private readonly productService: ProductService) { }
  private readonly logger = new (require('@nestjs/common').Logger)(ProductAppController.name);
  @Get() // --- 1. Dành cho HTTP (Frontend gọi) ---
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllProductResponseDto> {
    try {
      return await this.productService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  // --- 2. Dành cho TCP (Service nội bộ gọi lấy data) ---
  // Pattern: Request-Response
  @MessagePattern({ cmd: CMD.GET_PRODUCT_INFO })
  async getProductById(@Payload() id: string): Promise<GetByIdProductResponseDto | null> {
    this.logger.log('data:', id);
    try {
      return await this.productService.getById(id);
    } catch (error) {
      throw error;
    }
  }


  // @Get(':id')
  // async getProductById(@Param('id') id: string): Promise<GetByIdProductResponseDto | null> {
  //   try {
  //     return await this.productService.getById(id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
