import { AllExceptionsFilter } from '@core/filters/sequelize-exception.filter';
import { BaseResponseInterceptor } from '@core/interceptors/base-response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PaginationQueryDto } from '@shared/dto/common';
import { BaseGetResponse } from '@shared/interface/common';
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
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '@/modules/users/dto/user.admin.request.dto';
import { UserModel } from '@modules/users/domain/models/user.model';
import { UserService } from '@modules/users/services/user.service';
import { GetAllUserAdminResponseDto, GetByIdUserAdminResponseDto } from '@/modules/users/dto/user.admin.response.dto';
import { JWTAuthGuard } from '@core/guards/jwt.guard';
import { UserContextInterceptor } from '@core/interceptors/user-context.interceptor';
import { Ctx, EventPattern, MessagePattern, Payload, TcpContext } from '@nestjs/microservices';

@ApiBearerAuth('Authorization')
@Controller({ path: 'user-admin', version: '1' })
@UseInterceptors(new BaseResponseInterceptor(), new LoggingInterceptor())
@UseFilters(new AllExceptionsFilter())
export class UserAdminController {
  constructor(private readonly userService: UserService) { }
  @ApiOkResponse({ description: 'Danh sách user phân trang', type: BaseGetResponse<UserModel> })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  async getPagination(@Query() query: PaginationQueryDto) {
    try {
      return this.userService.getPagination(query);
    } catch (error) {
      console.log("error user service: ", error);
      throw error;
    }
  }
  
  @Get(':id')
  @MessagePattern({ cmd: 'get_user' })
  @UseGuards(JWTAuthGuard)
  // async getUserAdminById(@Payload() @Param('id') id: string): Promise<GetByIdUserAdminResponseDto | null> {
  async getUserAdminById(@Payload() @Param('id') id: string): Promise<any | null> {
    try {
      console.log('📩 Received from order-service:', id);
      return await this.userService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('getRolePermissionByUserId/:id')
  @UseGuards(JWTAuthGuard)
  async getRolePermissionByUserId(@Param('id') id: string): Promise<any | null> {
    try {
      return await this.userService.getRolePermissionByUserId(id);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JWTAuthGuard)
  // @UseInterceptors(UserContextInterceptor)
  @Post()
  // @EventPattern('user_created')
  @MessagePattern({ cmd: 'user_created' })
  async create(@Payload() @Body() payload: CreatedUserAdminRequestDto, @Ctx() context: TcpContext) {
    console.log('Client IP:', context);
    console.log('payload create user:', payload);
    try {
      // return await this.userService.create(payload);
      return await this.userService.create(payload);
    } catch (error) {
      console.log('error create user:', error);
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  async updateUserAdmin(@Param('id') id: string, @Body() dto: UpdatedUserAdminRequestDto) {
    try {
      return await this.userService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  async deleteUserAdmin(@Param('id') id: string): Promise<void> {
    try {
      return await this.userService.delete(id);
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }

  @Patch('/restore/:id')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(UserContextInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreUserAdmin(@Param('id') id: string): Promise<any> {
    return await this.userService.restoreUser(id);
  }
}
