import { PaginationQueryDto } from '@/dto/common';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from './controller/brand.controller';
import {
  CreatedBrandRequestDto,
  UpdatedBrandRequestDto,
} from './DTO/brand.request.dto';
import { BrandService } from './services/brand.service';

// DTO và model giả định (thay theo dự án thật)

describe('BrandController', () => {
  let controller: BrandController;
  let service: jest.Mocked<BrandService & { create: jest.Mock<any, any> }>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        {
          provide: BrandService,
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

    controller = module.get<BrandController>(BrandController);
    service = module.get(BrandService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPagination', () => {
    it('gọi service.getPagination và trả về kết quả', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const expected: any = {
        success: true,
        data: [
          {
            id: '1',
            name: 'Nike',
            image: '',
            is_public: true,
            created_at: new Date(),
            updated_at: new Date(),
            // add other required BrandModel properties with mock values here
          },
        ],
        totalRecord: 1,
      };
      service.getPagination.mockResolvedValue(expected);

      const result = await controller.getPagination(query);

      expect(service.getPagination).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('getBrandById', () => {
    it('trả về brand khi tồn tại', async () => {
      const brand: any = {
        id: '1',
        name: 'Adidas',
        image: '',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        // add other required BrandModel properties with mock values here
      };
      service.getById.mockResolvedValue(brand);

      const result = await controller.getBrandById('1');

      expect(service.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(brand);
    });

    it('ném NotFound khi service trả về null', async () => {
      service.getById.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.getBrandById('404')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('gọi service.create và trả về kết quả', async () => {
      const dto: CreatedBrandRequestDto = {
        name: 'Puma',
        image: '',
        is_public: true,
      };
      const expected = { id: '1', name: 'Puma' };
      service.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('updateBrand', () => {
    it('gọi service.update và trả về void', async () => {
      const dto: UpdatedBrandRequestDto = {
        name: 'Reebok',
        image: 'sd',
        is_public: true,
      };
      service.update.mockResolvedValue(undefined);

      const result = await controller.updateBrand('1', dto);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toBeUndefined();
    });
  });

  describe('deleteBrand', () => {
    it('gọi service.delete và trả về void', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.deleteBrand('1');

      expect(service.delete).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });
  });
});
