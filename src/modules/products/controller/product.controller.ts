import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { ProductModel } from '@/modules/products/domain/models/product.model';
import { CreatedProductRequestDto, UpdatedProductRequestDto } from '@/modules/products/DTO/product.request.dto';
import { ProductService } from '@/modules/products/services/product.service';
import { BaseGetResponse } from '@/shared/interface/common';
import { ForbidPasswordInUpdatePipe } from '@/shared/pipe';
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
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('Authorization')
@Controller('products')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<BaseGetResponse<ProductModel>> {
    try {
      return await this.productService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async getProductById(@Param('id') id: string): Promise<ProductModel | null> {
    try {
      return await this.productService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  @Post()
  async create(@Body() createProductDto: CreatedProductRequestDto) {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ForbidPasswordInUpdatePipe())
  async updateProduct(@Param('id') id: string, @Body() dto: UpdatedProductRequestDto) {
    try {
      return await this.productService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    try {
      return await this.productService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
