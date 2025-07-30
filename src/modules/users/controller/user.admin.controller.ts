import { Body, Controller, Get, Patch, Param, Post, Query, UsePipes, ValidationPipe, Delete } from '@nestjs/common';
import { UserModel } from 'models/user.model';
import { PaginationQueryDto } from 'src/dto/common';
import { BaseResponseDto } from 'src/shared/interface/common';
import { UserService } from '../services/user.service';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '../DTO/user.admin.request.dto';
import { ForbidPasswordInUpdatePipe } from 'src/shared/pipe';

@Controller('admin/users')
export class UserAdminController {
    constructor(private readonly userService: UserService) { }

    @Get('all')
    async getAllUsers():Promise<BaseResponseDto<UserModel[]>> {
        return await this.userService.getAllUsers();
    }

    @Get()
    // @CacheKey('user:123')
    @CacheTTL(60)
    async getPagination(@Query() query:PaginationQueryDto): Promise<BaseResponseDto<UserModel[]>> {
        return await this.userService.getPaginationUsers(query);
    }


    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    create(@Body() createUserDto: CreatedUserAdminRequestDto) {
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
    // @Post()

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.userService.findOne(id);
    // }

    // @Post()
    // create(@Body() createUserDto: CreateUserDto) {
    //     return this.userService.create(createUserDto);
    // }

    // @Put(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.userService.update(id, updateUserDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.userService.remove(id);
    // }
}