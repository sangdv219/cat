import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PermissionsService } from '@modules/permissions/services/permissions.service';
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
  Query,
  UseFilters,
  UseInterceptors,
  Version
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '@shared/dto/common';
import { UpdatedPermissionssRequestDto } from '../dto/permissions.request.dto';
import { GetAllPermissionsResponseDto, GetByIdPermissionsResponseDto } from '@modules/permissions/dto/permissions.response.dto';

@ApiBearerAuth('Authorization')
@Controller({ path:'app/permissions', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class PermissionsAppController {
  constructor(
    private readonly permissionService: PermissionsService
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllPermissionsResponseDto> {
    try {
      return await this.permissionService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Version('1')
  @Get(':id')
  async getPermissionsById(@Param('id') id: string): Promise<GetByIdPermissionsResponseDto | null> {
    try {
      return await this.permissionService.getById(id);
    } catch (error) {
      throw error;
    }
  }


  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePermissions(@Param('id') id: string, @Body() dto: UpdatedPermissionssRequestDto) {
    try {
      return await this.permissionService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePermissions(@Param('id') id: string): Promise<void> {
    try {
      return await this.permissionService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
