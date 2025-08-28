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
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '../DTO/user.admin.request.dto';
import { UserModel } from '../domain/models/user.model';
import { UserService } from '../services/user.service';

@ApiBearerAuth('Authorization')
@Controller('user-admin')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class UserAdminController {
  constructor(private readonly productService: UserService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<BaseGetResponse<UserModel>> {
    try {
      return await this.productService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async getUserAdminById(@Param('id') id: string): Promise<UserModel | null> {
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
  async create(@Body() createUserAdminDto: CreatedUserAdminRequestDto) {
    try {
      return await this.productService.create(createUserAdminDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ForbidPasswordInUpdatePipe())
  async updateUserAdmin(@Param('id') id: string, @Body() dto: UpdatedUserAdminRequestDto) {
    try {
      return await this.productService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserAdmin(@Param('id') id: string): Promise<void> {
    try {
      return await this.productService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
