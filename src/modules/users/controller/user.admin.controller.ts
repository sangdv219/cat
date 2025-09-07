import { AllExceptionsFilter } from '@/core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@/core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@/dto/common';
import { BaseGetResponse } from '@/shared/interface/common';
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
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '../DTO/user.admin.request.dto';
import { UserModel } from '../domain/models/user.model';
import { UserService } from '../services/user.service';
import { GetByIdUserAdminResponseDto } from '../DTO/user.admin.response.dto';

@ApiBearerAuth('Authorization')
@Controller('user-admin')
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class UserAdminController {
  constructor(private readonly userService: UserService) { }

  @ApiOkResponse({ description: 'Danh sách user phân trang', type: BaseGetResponse<UserModel>})
  @Get()
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JWTAuthGuard)
  @CacheTTL(60)
  async getPagination(@Query() query: PaginationQueryDto): Promise<BaseGetResponse<UserModel>> {
    try {
      return this.userService.getPagination(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  // @UseGuards(JWTAuthGuard)
  async getUserAdminById(@Param('id') id: string): Promise<GetByIdUserAdminResponseDto | null> {
    try {
      return await this.userService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JWTAuthGuard)
  @Post()
  async create(@Body() createUserAdminDto: CreatedUserAdminRequestDto) {
    try {
      return await this.userService.create(createUserAdminDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(JWTAuthGuard)
  // @UsePipes(new ForbidPasswordInUpdatePipe())
  async updateUserAdmin(@Param('id') id: string, @Body() dto: UpdatedUserAdminRequestDto) {
    try {
      return await this.userService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  // @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserAdmin(@Param('id') id: string): Promise<void> {
    try {
      return await this.userService.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // @Patch(':id')
  // // @UseGuards(JWTAuthGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async restoreUserAdmin(@Param('id') id: string): Promise<UpdateCreateResponse<UserModel>> {
  //   return await this.userService.restoreUser(id);
  // }
}
