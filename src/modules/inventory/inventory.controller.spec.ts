import { PaginationQueryDto } from '@/dto/common';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreatedInventoryRequestDto,
  UpdatedInventoryRequestDto,
} from './dto/inventory.request.dto';
import { InventoryService } from './services/inventory.service';
import { InventoryAdminController } from './controller/inventory.admin.controller';

// DTO và model giả định (thay theo dự án thật)

describe('InventoryController', () => {
  let controller: InventoryAdminController;
  let service: jest.Mocked<InventoryService & { create: jest.Mock<any, any> }>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryAdminController],
      providers: [
        {
          provide: InventoryService,
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

    controller = module.get<InventoryAdminController>(InventoryAdminController);
    service = module.get(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPagination', () => {
    it('gọi service.getPagination và trả về kết quả', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10, keyword: 'test' };
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
            // add other required InventoryModel properties with mock values here
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

  describe('getInventoryById', () => {
    it('trả về Inventory khi tồn tại', async () => {
      const Inventory: any = {
        id: '1',
        name: 'Adidas',
        image: '',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        // add other required InventoryModel properties with mock values here
      };
      service.getById.mockResolvedValue(Inventory);

      const result = await controller.getInventoryById('1');

      expect(service.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(Inventory);
    });

    it('ném NotFound khi service trả về null', async () => {
      service.getById.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.getInventoryById('404')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('gọi service.create và trả về kết quả', async () => {
      const dto: CreatedInventoryRequestDto = {
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

  describe('updateInventory', () => {
    it('gọi service.update và trả về void', async () => {
      const dto: UpdatedInventoryRequestDto = {
        name: 'Reebok',
        image: 'sd',
        is_public: true,
      };
      service.update.mockResolvedValue(undefined);

      const result = await controller.updateInventory('1', dto);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toBeUndefined();
    });
  });

  describe('deleteInventory', () => {
    it('gọi service.delete và trả về void', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.deleteInventory('1');

      expect(service.delete).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });
  });
});
