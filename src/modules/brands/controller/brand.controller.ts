import { PaginationQueryDto } from '@/dto/common';
import { BrandModel } from '@/models/branch.model';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { PermissionAuthGuard } from '@/modules/auth/guards/permission.guard';
import { CreatedBrandRequestDto, UpdatedBrandRequestDto } from '@/modules/brands/DTO/brand.request.dto';
import { BrandService } from '@/modules/brands/services/brand.service';
import { BaseResponse } from '@/shared/interface/common';
import { ForbidPasswordInUpdatePipe } from '@/shared/pipe';
import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('Authorization')
@Controller('brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    @UseGuards(JWTAuthGuard)
    @CacheTTL(60)
    async getPagination(@Query() query:PaginationQueryDto): Promise<BaseResponse<BrandModel[]>> {
        return await this.brandService.getPagination(query);
    }

    @Get(':id')
    @UseGuards(JWTAuthGuard)
    async getBrandById(@Param('id') id: string): Promise<BrandModel | null> {
        return await this.brandService.getById(id);
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async create(@Body() createBrandDto: CreatedBrandRequestDto) {
        return this.brandService.create(createBrandDto);
    }
    
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ForbidPasswordInUpdatePipe())
    async updateBrand(@Param('id') id: string, @Body() body: UpdatedBrandRequestDto):Promise<void> {
        return await this.brandService.update(id, body);
    }
    
    @Delete(':id')
    @UseGuards(JWTAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBrand(@Param('id') id: string):Promise<void> {
        return await this.brandService.delete(id);
    }
}