import { BaseResponse } from '@/core/repositories/base.repository';
import { PaginationQueryDto } from '@/dto/common';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { CategoryModel } from '@/modules/categories/domain/models/category.model';
import { CreatedCategoryRequestDto, UpdatedCategoryRequestDto } from '@/modules/categories/DTO/category.request.dto';
import { CategoryService } from '@/modules/categories/services/category.service';
import { ForbidPasswordInUpdatePipe } from '@/shared/pipe';
import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CATEGORY_ENTITY } from '../constants/category.constant';

@ApiBearerAuth('Authorization')
@Controller(CATEGORY_ENTITY.TABLE_NAME)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    @UseGuards(JWTAuthGuard)
    @CacheTTL(60)
    async getPagination(@Query() query:PaginationQueryDto): Promise<BaseResponse<CategoryModel[]>> {
        return await this.categoryService.getPagination(query);
    }

    @Get(':id')
    @UseGuards(JWTAuthGuard)
    async getCategoryById(@Param('id') id: string): Promise<CategoryModel | null> {
        return await this.categoryService.getById(id);
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async create(@Body() createCategoryDto: CreatedCategoryRequestDto) {
        return this.categoryService.create(createCategoryDto);
    }
    
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ForbidPasswordInUpdatePipe())
    async updateCategory(@Param('id') id: string, @Body() body: UpdatedCategoryRequestDto):Promise<void> {
        return await this.categoryService.update(id, body);
    }
    
    @Delete(':id')
    @UseGuards(JWTAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCategory(@Param('id') id: string):Promise<void> {
        return await this.categoryService.delete(id);
    }
}