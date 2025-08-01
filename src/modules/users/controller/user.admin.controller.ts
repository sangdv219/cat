import { PaginationQueryDto } from '@/dto/common';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '@/modules/users/DTO/user.admin.request.dto';
import { UserService } from '@/modules/users/services/user.service';
import { BaseResponse } from '@/shared/interface/common';
import { ForbidPasswordInUpdatePipe } from '@/shared/pipe';
import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserModel } from 'models/user.model';

@Controller('admin/users')
export class UserAdminController {
    constructor(private readonly userService: UserService) { }

    @Get('all')
    async getAllUsers():Promise<BaseResponse<UserModel[]>> {
        return await this.userService.getAllUsers();
    }
    
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserModel | null> {
        return await this.userService.findOne(id);
    }
    
    @Get()
    @UseGuards(JWTAuthGuard)
    @CacheTTL(60)
    async getPagination(@Query() query:PaginationQueryDto): Promise<BaseResponse<UserModel[]>> {
        return await this.userService.getPaginationUsers(query);
    }


    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async create(@Body() createUserDto: CreatedUserAdminRequestDto) {
        return this.userService.createdUser(createUserDto);
    }

    @Patch(':id')
    @UsePipes(new ForbidPasswordInUpdatePipe())
    async updateUser(@Param('id') id: string, @Body() body: UpdatedUserAdminRequestDto) {
        return await this.userService.updatedUser(id, body);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.deletedUser(id);
    }

    @Patch(':id/restore')
    async restoreUser(@Param('id') id: string) {
        return await this.userService.restoreUser(id);
    }
}