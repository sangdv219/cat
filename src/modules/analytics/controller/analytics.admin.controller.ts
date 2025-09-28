import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { JWTAuthGuard } from '@core/guards/jwt.guard';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { CreatedAnalyticsRequestDto, UpdatedAnalyticsRequestDto } from '@modules/analytics/dto/analytics.request.dto';
import { AnalyticsService } from '@modules/analytics/services/analytics.service';
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
import { GetAllAnalyticsResponseDto, GetByIdAnalyticsResponseDto } from '@modules/analytics/dto/analytics.response.dto';
import { UserContextInterceptor } from '@/core/interceptors/user-context.interceptor';

@ApiBearerAuth('Authorization')
@Controller('admin/analytics')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class AnalyticsAdminController {
  constructor(private readonly categoryService: AnalyticsService) { }

  @Get('users/product-diversity')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async analyticsDiversity(@Query() query: PaginationQueryDto): Promise<any> {
    try {
      return await this.categoryService.analyticsDiversity(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async getAnalyticsById(@Param('id') id: string): Promise<GetByIdAnalyticsResponseDto | null> {
    try {
      return await this.categoryService.getById(id);
    } catch (error) {
      throw error;
    }
  }

}
