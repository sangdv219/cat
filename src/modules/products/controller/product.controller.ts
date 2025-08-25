import { PaginationQueryDto } from '@/dto/common';
import { ProductModel } from '@/modules/products/domain/models/product.model';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { PermissionAuthGuard } from '@/modules/auth/guards/permission.guard';
import { CreatedProductRequestDto, UpdatedProductRequestDto } from '@/modules/products/DTO/product.request.dto';
import { ProductService } from '@/modules/products/services/product.service';
import { BaseResponse } from '@/core/repositories/base.repository';
import { ForbidPasswordInUpdatePipe } from '@/shared/pipe';
import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('Authorization')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    @UseGuards(JWTAuthGuard)
    @CacheTTL(60)
    async getPagination(@Query() query:PaginationQueryDto): Promise<BaseResponse<ProductModel[]>> {
        return await this.productService.getPagination(query);
    }

    @Get(':id')
    @UseGuards(JWTAuthGuard)
    async getProductById(@Param('id') id: string): Promise<ProductModel | null> {
        return await this.productService.getById(id);
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async create(@Body() createProductDto: CreatedProductRequestDto) {
        return this.productService.create(createProductDto);
    }
    
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ForbidPasswordInUpdatePipe())
    async updateProduct(@Param('id') id: string, @Body() body: UpdatedProductRequestDto):Promise<void> {
        return await this.productService.update(id, body);
    }
    
    @Delete(':id')
    @UseGuards(JWTAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteProduct(@Param('id') id: string):Promise<void> {
        return await this.productService.delete(id);
    }
}