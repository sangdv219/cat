import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { CreatedProductRequestDto, UpdatedProductRequestDto } from '@modules/products/DTO/product.request.dto';
import { ProductService } from '@modules/products/services/product.service';
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
import { GetAllProductResponseDto, GetByIdProductResponseDto } from '../DTO/product.response.dto';

@ApiBearerAuth('Authorization')
@Controller('app/products')
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
  
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createProductDto: CreatedProductRequestDto) {
    try {
      return await this.userService.create(createProductDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProduct(@Param('id') id: string, @Body() dto: UpdatedProductRequestDto) {
    try {
      return await this.userService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    try {
      return await this.userService.delete(id);
    } catch (error) {
      throw error;
    }
  }

}
