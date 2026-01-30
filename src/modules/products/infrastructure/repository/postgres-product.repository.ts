import { ProductModel } from '@modules/products/domain/models/product.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractProductRepository } from '@modules/products/domain/abstract/abstract-product.repository';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { IPaginationDTO } from '@/core/repositories/base.repository';

export interface IPaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PostgresProductRepository extends AbstractProductRepository {
  private static readonly searchableFields = ['sku', 'price', 'promotion_price', 'evaluate'];
  constructor(
    @InjectModel(ProductModel)
    protected readonly productModel: typeof ProductModel,
  ) {
    super(productModel, PostgresProductRepository.searchableFields);
    
  }

  async paginate(params: IPaginationDTO, options: FindOptions<ProductModel> = {}): Promise<IPaginatedResult<ProductModel>> {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const offset = (page - 1) * limit;

    // 1. Xử lý Sort
    let order: any = [['created_at', 'DESC']];
    if (params.sortOrder) {
        const direction = params.sortOrder.startsWith('-') ? 'DESC' : 'ASC';
        const column = params.sortOrder.replace('-', '');
        order = [[column, direction]];
    }

    // 2. Xử lý Filter & Keyword
    let whereClause: WhereOptions = options.where || {}; // Lấy filter gốc từ Service truyền xuống
    
    // Nếu có keyword và có khai báo searchableFields -> Merge điều kiện Search
    if (params.keyword && this.searchableFields.length > 0) {
      const searchCondition = {
        [Op.or]: this.searchableFields.map(field => ({
          [field]: { [Op.iLike]: `%${params.keyword}%` }
        }))
      };
      
      // Kết hợp logic: (Filter gốc) AND (Search Keyword)
      // Ví dụ: (price > 100) AND (name LIKE %abc% OR code LIKE %abc%)
      whereClause = {
        [Op.and]: [whereClause, searchCondition]
      };
    }

    const { rows, count } = await this.model.findAndCountAll({
      ...options, // Spread options để lấy include, attributes...
      where: whereClause,
      limit,
      offset,
      order: options.order || order,
    });

    return {
      items: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
