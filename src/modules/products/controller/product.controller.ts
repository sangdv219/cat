import { PaginationQueryDto } from '@/dto/common';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { PermissionAuthGuard } from '@/modules/auth/guards/permission.guard';
import { CreatedProductRequestDto, UpdatedProductRequestDto } from '@/modules/products/DTO/product.request.dto';
import { ProductService } from '@/modules/products/services/product.service';
import { BaseResponse } from '@/shared/interface/common';
import { ForbidPasswordInUpdatePipe } from '@/shared/pipe';
import { ProductModel } from '@models/product.model';
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
    // @UseGuards(JWTAuthGuard,PermissionAuthGuard)
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
        return this.productService.createImpl(createProductDto);
    }
    
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ForbidPasswordInUpdatePipe())
    async updateProduct(@Param('id') id: string, @Body() body: UpdatedProductRequestDto) {
        return await this.productService.update(id, body);
    }
    
    @Delete(':id')
    @UseGuards(JWTAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.delete(id);
    }
}