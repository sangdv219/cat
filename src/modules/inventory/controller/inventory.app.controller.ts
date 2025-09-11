import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
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
import { CreatedInventoryRequestDto, UpdatedInventoryRequestDto } from '../dto/inventory.request.dto';
import { GetAllInventoryResponseDto, GetByIdInventoryResponseDto } from '../dto/inventory.response.dto';
import { InventoryService } from '../services/inventory.service';

@Controller('app/inventory')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class InventoryAppController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllInventoryResponseDto> {
    try {
      return await this.inventoryService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getInventoryById(@Param('id') id: string): Promise<GetByIdInventoryResponseDto | null> {
    try {
      return await this.inventoryService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('/product/:id')
  async getByProductId(@Param('id') id: string): Promise<GetByIdInventoryResponseDto | null> {
    try {
      return await this.inventoryService.getByProductId(id);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createInventoryDto: CreatedInventoryRequestDto) {
    try {
      return await this.inventoryService.create(createInventoryDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateInventory(@Param('id') id: string, @Body() dto: UpdatedInventoryRequestDto) {
    try {
      return await this.inventoryService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInventory(@Param('id') id: string): Promise<void> {
    try {
      return await this.inventoryService.delete(id);
    } catch (error) {
      throw error;
    }
  }

}
