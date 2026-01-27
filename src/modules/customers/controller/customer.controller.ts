import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { JWTAuthGuard } from '@core/guards/jwt.guard';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@shared/dto/common';
import { CreatedCustomerRequestDto, UpdatedCustomerRequestDto } from '@modules/customers/dto/customer.request.dto';
import { CustomerService } from '@modules/customers/services/customer.service';
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
import { GetAllCustomerResponseDto, GetByIdCustomerResponseDto } from '@modules/customers/dto/customer.response.dto';
import { UserContextInterceptor } from '@core/interceptors/user-context.interceptor';

@ApiBearerAuth('Authorization')
@Controller({ path:'admin/customer', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Get()
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<GetAllCustomerResponseDto> {
    try {
      return await this.customerService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async getCustomerById(@Param('id') id: string): Promise<GetByIdCustomerResponseDto | null> {
    try {
      return await this.customerService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  async create(@Body() createCustomerDto: CreatedCustomerRequestDto) {
    try {
      return await this.customerService.create(createCustomerDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  async updateCustomer(@Param('id') id: string, @Body() dto: UpdatedCustomerRequestDto) {
    try {
      return await this.customerService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    try {
      return await this.customerService.delete(id);
    } catch (error) {
      throw error;
    }
  }

}
