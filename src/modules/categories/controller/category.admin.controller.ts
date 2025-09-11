import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { JWTAuthGuard } from '@/core/guards/jwt.guard';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { CreatedCategoryRequestDto, UpdatedCategoryRequestDto } from '@/modules/categories/dto/category.request.dto';
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
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAllCategoryResponseDto, GetByIdCategoryResponseDto } from '../dto/category.response.dto';

@ApiBearerAuth('Authorization')
@Controller('admin/categories')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  @UseGuards(JWTAuthGuard)
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
  @UseGuards(JWTAuthGuard)
  async getCategoryById(@Param('id') id: string): Promise<GetByIdCategoryResponseDto | null> {
    try {
      return await this.categoryService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @Post()
  async create(@Body() createCategoryDto: CreatedCategoryRequestDto) {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  async updateCategory(@Param('id') id: string, @Body() dto: UpdatedCategoryRequestDto) {
    try {
      return await this.categoryService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: string): Promise<void> {
    try {
      return await this.categoryService.delete(id);
    } catch (error) {
      throw error;
    }
  }

}
