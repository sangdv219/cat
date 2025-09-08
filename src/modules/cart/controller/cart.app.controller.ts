import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { CreatedCartRequestDto, UpdatedCartRequestDto } from '@/modules/cart/dto/cart.request.dto';
import { CartService } from '@modules/cart/services/cart.service';
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
import { GetAllCartResponseDto, GetByIdCartResponseDto } from '../dto/cart.response.dto';

@ApiBearerAuth('Authorization')
@Controller('app/cart')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class CartAppController {
  constructor(private readonly CartService: CartService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllCartResponseDto> {
    try {
      return await this.CartService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getCartById(@Param('id') id: string): Promise<GetByIdCartResponseDto | null> {
    try {
      return await this.CartService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createCartDto: CreatedCartRequestDto) {
    try {
      return await this.CartService.create(createCartDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCart(@Param('id') id: string, @Body() dto: UpdatedCartRequestDto) {
    try {
      return await this.CartService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCart(@Param('id') id: string): Promise<void> {
    try {
      return await this.CartService.delete(id);
    } catch (error) {
      throw error;
    }
  }

}
