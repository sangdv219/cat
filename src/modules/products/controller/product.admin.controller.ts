import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { JWTAuthGuard } from '@core/guards/jwt.guard';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@shared/dto/common';
import { CreatedProductRequestDto, FilterProductRequestDto, UpdatedProductRequestDto } from '@modules/products/dto/product.request.dto';
import { ProductService } from '@modules/products/services/product.service';
import { CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAllProductResponseDto, GetByIdProductResponseDto } from '../dto/product.response.dto';
import { UserContextInterceptor } from '@core/interceptors/user-context.interceptor';

@ApiBearerAuth('Authorization')
@Controller({ path: 'admin/products', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class ProductAdminController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  // @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: FilterProductRequestDto): Promise<GetAllProductResponseDto> {
    try {
      return await this.productService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

//   @Get(':id')
//   @UseGuards(JWTAuthGuard)
//   async getProductById(@Param('id') id: string): Promise<GetByIdProductResponseDto | null> {
//     try {
//       return await this.productService.getById(id);
//     } catch (error) {
//       throw error;
//     }
//   }

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   @UseGuards(JWTAuthGuard)
//   @UseInterceptors(UserContextInterceptor)
//   async create(@Body() createProductDto: CreatedProductRequestDto) {
//     try {
//       return await this.productService.create(createProductDto);
//     } catch (error) {
//       throw error;
//     }
//   }

//   @Patch(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @UseGuards(JWTAuthGuard)
//   @UseInterceptors(UserContextInterceptor)
//   async updateProduct(@Param('id') id: string, @Body() dto: UpdatedProductRequestDto) {
//     try {
//       return await this.productService.update(id, dto);
//     } catch (error) {
//       throw error;
//     }
//   }

//   @Delete(':id')
//   @UseGuards(JWTAuthGuard)
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @UseInterceptors(UserContextInterceptor)
//   async deleteProduct(@Param('id') id: string): Promise<void> {
//     try {
//       return await this.productService.delete(id);
//     } catch (error) {
//       throw error;
//     }
//   }

}
