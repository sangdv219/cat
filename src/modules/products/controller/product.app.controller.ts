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
import { GetAllProductResponseDto, GetByIdProductResponseDto } from '../dto/product.response.dto';

@ApiBearerAuth('Authorization')
@Controller({ path:'app/products', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class ProductAppController {
  constructor(private readonly userService: ProductService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllProductResponseDto> {
    try {
      return await this.userService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }
  
  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<GetByIdProductResponseDto | null> {
    try {
      return await this.userService.getById(id);
    } catch (error) {
      throw error;
    }
  }
}
