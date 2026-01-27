import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter'
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor'
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor'
import { PaginationQueryDto } from '@shared/dto/common'
import { CacheTTL } from '@nestjs/cache-manager'
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { GetAllCartResponseDto, GetByIdCartResponseDto } from '../dto/cart.response.dto'
import { CartService } from '../services/cart.service'

@ApiBearerAuth('Authorization')
@Controller({ path: 'app/carts', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class CartAppController {
  constructor(private readonly userService: CartService) {}

  @Get()
  //   @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllCartResponseDto> {
    try {
      return await this.userService.getPagination(query)
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  // @UseGuards(JWTAuthGuard)
  async getCartById(@Param('id') id: string): Promise<GetByIdCartResponseDto | null> {
    try {
      return await this.userService.getById(id)
    } catch (error) {
      throw error
    }
  }
}
