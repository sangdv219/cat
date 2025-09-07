import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { BaseGetResponse } from '@/shared/interface/common';
import { CategoryModel } from '@modules/categories/domain/models/category.model';
import { CreatedCategoryRequestDto, UpdatedCategoryRequestDto } from '@modules/categories/DTO/category.request.dto';
import { CategoryService } from '@modules/categories/services/category.service';
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

@ApiBearerAuth('Authorization')
@Controller('app/categories')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class CategoryAppController {
  constructor(private readonly userService: CategoryService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<BaseGetResponse<CategoryModel>> {
    try {
      return await this.userService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryModel | null> {
    try {
      return await this.userService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createCategoryDto: CreatedCategoryRequestDto) {
    try {
      return await this.userService.create(createCategoryDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCategory(@Param('id') id: string, @Body() dto: UpdatedCategoryRequestDto) {
    try {
      return await this.userService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: string): Promise<void> {
    try {
      return await this.userService.delete(id);
    } catch (error) {
      throw error;
    }
  }

}
