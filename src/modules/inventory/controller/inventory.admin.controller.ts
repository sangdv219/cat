import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { JWTAuthGuard } from '@core/guards/jwt.guard';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@shared/dto/common';
import { CreatedInventoryRequestDto, UpdatedInventoryRequestDto } from '@modules/inventory/dto/inventory.request.dto';
import { InventoryService } from '@modules/inventory/services/inventory.service';
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
import { GetAllInventoryResponseDto } from '../dto/inventory.response.dto';
import { UserContextInterceptor } from '@core/interceptors/user-context.interceptor';

@ApiBearerAuth('Authorization')
@Controller({ path:'admin/inventorys', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class InventoryAdminController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Get()
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllInventoryResponseDto> {
    try {
      return await this.inventoryService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  // @Get(':id')
  // @UseGuards(JWTAuthGuard)
  // async getInventoryById(@Param('id') id: string): Promise<GetByIdInventoryResponseDto | null> {
  //   try {
  //     return await this.inventoryService.getById(id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  async create(@Body() createInventoryDto: CreatedInventoryRequestDto) {
    try {
      return await this.inventoryService.create(createInventoryDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  async updateInventory(@Param('id') id: string, @Body() dto: UpdatedInventoryRequestDto) {
    try {
      return await this.inventoryService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInventory(@Param('id') id: string): Promise<void> {
    try {
      return await this.inventoryService.delete(id);
    } catch (error) {
      throw error;
    }
  }

}
