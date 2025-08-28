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
import { CreatedBrandRequestDto, UpdatedBrandRequestDto } from '../DTO/brand.request.dto';
import { BrandService } from '../services/brand.service';
import { BrandModel } from '../domain/models/brand.model';

@ApiBearerAuth('Authorization')
@Controller('brands')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class BrandController {
  constructor(private readonly productService: BrandService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<BaseGetResponse<BrandModel>> {
    try {
      return await this.productService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async getBrandAdminById(@Param('id') id: string): Promise<BrandModel | null> {
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
  async create(@Body() createBrandAdminDto: CreatedBrandRequestDto) {
    try {
      return await this.productService.create(createBrandAdminDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ForbidPasswordInUpdatePipe())
  async updateBrandAdmin(@Param('id') id: string, @Body() dto: UpdatedBrandRequestDto) {
    try {
      return await this.productService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBrandAdmin(@Param('id') id: string): Promise<void> {
    try {
      return await this.productService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
