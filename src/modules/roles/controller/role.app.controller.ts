import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { RolesService } from '@modules/roles/services/roles.service';
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
import { UpdatedRolesRequestDto } from '../dto/role.request.dto';
import { GetAllRoleResponseDto, GetByIdRoleResponseDto } from '../dto/role.response.dto';

@ApiBearerAuth('Authorization')
@Controller({ path:'app/roles', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class RoleAppController {
  constructor(
    private readonly roleService: RolesService
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllRoleResponseDto> {
    try {
      return await this.roleService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Version('1')
  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<GetByIdRoleResponseDto | null> {
    try {
      return await this.roleService.getById(id);
    } catch (error) {
      throw error;
    }
  }


  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateRole(@Param('id') id: string, @Body() dto: UpdatedRolesRequestDto) {
    try {
      return await this.roleService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(@Param('id') id: string): Promise<void> {
    try {
      return await this.roleService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
