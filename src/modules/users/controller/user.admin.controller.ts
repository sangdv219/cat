import { PaginationQueryDto } from '@/dto/common';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { PermissionAuthGuard } from '@/modules/auth/guards/permission.guard';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '@/modules/users/DTO/user.admin.request.dto';
import { UserService } from '@/modules/users/services/user.service';
import { BaseResponse } from '@/shared/interface/common';
import { ForbidPasswordInUpdatePipe } from '@/shared/pipe';
import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserModel } from 'models/user.model';

@Controller('admin/users')
export class UserAdminController {
    constructor(private readonly userService: UserService) { }

    @Get(':id')
    @UseGuards(JWTAuthGuard)
    async getUserById(@Param('id') id: string): Promise<UserModel | null> {
        return await this.userService.getUserById(id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    @UseGuards(JWTAuthGuard,PermissionAuthGuard)
    @CacheTTL(60)
    async getPagination(@Query() query:PaginationQueryDto): Promise<BaseResponse<UserModel[]>> {
        return await this.userService.getPagination(query);
    }
    
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async create(@Body() createUserDto: CreatedUserAdminRequestDto) {
        return this.userService.createdUser(createUserDto);
    }
    
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ForbidPasswordInUpdatePipe())
    async updateUser(@Param('id') id: string, @Body() body: UpdatedUserAdminRequestDto) {
        return await this.userService.updatedUser(id, body);
    }
    
    @Delete(':id')
    @UseGuards(JWTAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') id: string) {
        return await this.userService.deletedUser(id);
    }
    
    @Patch(':id/restore')
    @UseGuards(JWTAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async restoreUser(@Param('id') id: string) {
        return await this.userService.restoreUser(id);
    }
}