import { PaginationQueryDto } from '@/dto/common';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './controller/product.controller';
import { CreatedProductRequestDto, UpdatedProductRequestDto } from './DTO/product.request.dto';
import { ProductService } from './services/product.service';

// DTO và model giả định (thay theo dự án thật)

describe('ProductController', () => {
  let controller: ProductController;
  let service: jest.Mocked<ProductService & { create: jest.Mock<any, any> }>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getPagination: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPagination', () => {
    it('gọi service.getPagination và trả về kết quả', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const expected: any = {
        success: true,
        data: [{
          id: '1',
          name: 'Nike',
          image: '',
          is_public: true,
          created_at: new Date(),
          updated_at: new Date(),
          // add other required ProductModel properties with mock values here
        }],
        totalRecord: 1
      };
      service.getPagination.mockResolvedValue(expected);

      const result = await controller.getPagination(query);

      expect(service.getPagination).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('getProductById', () => {
    it('trả về product khi tồn tại', async () => {
      const product: any = {
        id: '1',
        name: 'Adidas',
        image: '',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        // add other required ProductModel properties with mock values here
      };
      service.getById.mockResolvedValue(product);

      const result = await controller.getProductById('1');

      expect(service.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(product);
    });

    it('ném NotFound khi service trả về null', async () => {
      service.getById.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.getProductById('404')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('gọi service.create và trả về kết quả', async () => {
      const dto: CreatedProductRequestDto = { name: 'Puma', image: '', is_public: true };
      const expected = { id: '1', name: 'Puma' };
      service.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('updateProduct', () => {
    it('gọi service.update và trả về void', async () => {
      const dto: UpdatedProductRequestDto = { name: 'Reebok', image: 'sd', is_public: true };
      service.update.mockResolvedValue(undefined);

      const result = await controller.updateProduct('1', dto);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toBeUndefined();
    });
  });

  describe('deleteProduct', () => {
    it('gọi service.delete và trả về void', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.deleteProduct('1');

      expect(service.delete).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });
  });
});
