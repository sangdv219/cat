import { PaginationQueryDto } from '@shared/dto/common';
import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { GetAllCategoryResponseDto, GetByIdCategoryResponseDto } from '@/modules/categories/dto/category.response.dto';
import { CategoryService } from '@modules/categories/services/category.service';
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

@ApiBearerAuth('Authorization')
@Controller({ path:'app/categories', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class CategoryAppController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllCategoryResponseDto> {
    try {
      return await this.categoryService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<GetByIdCategoryResponseDto | null> {
    try {
      return await this.categoryService.getById(id);
    } catch (error) {
      throw error;
    }
  }
}
