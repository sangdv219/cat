import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt.guard';
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
import { CreatedCategoryRequestDto, UpdatedCategoryRequestDto } from '../DTO/category.request.dto';
import { CategoryService } from '../services/category.service';
import { CategoryModel } from '../domain/models/category.model';

@ApiBearerAuth('Authorization')
@Controller('categories')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class CategoryController {
  constructor(private readonly productService: CategoryService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<BaseGetResponse<CategoryModel>> {
    try {
      return await this.productService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async getCategoryAdminById(@Param('id') id: string): Promise<CategoryModel | null> {
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
  async create(@Body() createCategoryAdminDto: CreatedCategoryRequestDto) {
    try {
      return await this.productService.create(createCategoryAdminDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ForbidPasswordInUpdatePipe())
  async updateCategoryAdmin(@Param('id') id: string, @Body() dto: UpdatedCategoryRequestDto) {
    try {
      return await this.productService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategoryAdmin(@Param('id') id: string): Promise<void> {
    try {
      return await this.productService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
