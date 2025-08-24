import { PaginationQueryDto } from '@/dto/common';
import { CategoryModel } from '@/models/category.model';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { PermissionAuthGuard } from '@/modules/auth/guards/permission.guard';
import { BaseResponse } from '@/shared/interface/common';
import { ForbidPasswordInUpdatePipe } from '@/shared/pipe';
import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreatedCategoryRequestDto, UpdatedCategoryRequestDto } from '../DTO/categories.request.dto';
import { CategoryService } from '../services/categories.service';

@ApiBearerAuth('Authorization')
@Controller('categories')
export class CategoryController {
    constructor(private readonly productService: CategoryService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    @UseGuards(JWTAuthGuard)
    @CacheTTL(60)
    async getPagination(@Query() query:PaginationQueryDto): Promise<BaseResponse<CategoryModel[]>> {
        return await this.productService.getPagination(query);
    }

    @Get(':id')
    @UseGuards(JWTAuthGuard)
    async getCategoryById(@Param('id') id: string): Promise<CategoryModel | null> {
        return await this.productService.getById(id);
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async create(@Body() createCategoryDto: CreatedCategoryRequestDto) {
        return this.productService.createImpl(createCategoryDto);
    }
    
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ForbidPasswordInUpdatePipe())
    async updateCategory(@Param('id') id: string, @Body() body: UpdatedCategoryRequestDto) {
        return await this.productService.update(id, body);
    }
    
    @Delete(':id')
    @UseGuards(JWTAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCategory(@Param('id') id: string) {
        return await this.productService.delete(id);
    }
}