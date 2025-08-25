import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { BaseService } from '../services/base.service';

// Mock dependency types
interface Entity { id: string; name?: string }

const buildRedisKeyQuery = jest.fn((...args) => `redis:${args.join(':')}`);
const RedisContext = { LIST: 'list' } as const;

// Mock repository
const mockRepository = () => ({
  findWithPagination: jest.fn(),
  created: jest.fn(),
  findOne: jest.fn(),
  updated: jest.fn(),
  deleted: jest.fn(),
  getAll: jest.fn(),
  findByField: jest.fn(),
  findOneByRaw: jest.fn(),
});

// Mock cache manager
const mockCacheManage = () => ({
  get: jest.fn(),
  set: jest.fn(),
  delCache: jest.fn(),
  incrementVersion: jest.fn(),
  getCurrentVersion: jest.fn(),
  buildVersionedKey: jest.fn((key: string) => `versioned:${key}`),
});

// Fake service extends BaseService
class TestService extends BaseService<Entity> {
  protected entityName = 'Entity';
  protected repository = mockRepository();
  protected cacheManage:any = mockCacheManage();

  protected async moduleInit() {}
  protected async bootstrapLogic() {}
  protected async beforeAppShutDown(signal?: string) {}
  protected async moduleDestroy() {}

  protected async createImpl(body: Entity) {
    return { ...body, created: true };
  }

  protected async updateImpl(id: string, body: Entity) {
    return { ...body, id, updated: true };
  }
}

describe('BaseService', () => {
  let service: TestService;
  let repository: ReturnType<typeof mockRepository>;
  let cache: ReturnType<typeof mockCacheManage>;

  beforeEach(() => {
    service = new TestService();
    repository = service['repository'];
    cache = service['cacheManage'];
    jest.clearAllMocks();
  });

  describe('Lifecycle hooks', () => {
    it('onModuleInit gọi moduleInit()', async () => {
      const spy = jest.spyOn(service as any, 'moduleInit');
      await service.onModuleInit();
      expect(spy).toHaveBeenCalled();
    });

    it('onApplicationBootstrap gọi bootstrapLogic()', async () => {
      const spy = jest.spyOn(service as any, 'bootstrapLogic');
      await service.onApplicationBootstrap();
      expect(spy).toHaveBeenCalled();
    });

    it('beforeApplicationShutdown gọi beforeAppShutDown()', async () => {
      const spy = jest.spyOn(service as any, 'beforeAppShutDown');
      await service.beforeApplicationShutdown('SIGTERM');
      expect(spy).toHaveBeenCalledWith('SIGTERM');
    });

    it('onModuleDestroy gọi moduleDestroy()', async () => {
      const spy = jest.spyOn(service as any, 'moduleDestroy');
      await service.onModuleDestroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getPagination', () => {
    it('lấy từ cache nếu tồn tại', async () => {
      cache.get.mockResolvedValue(JSON.stringify({ success: true, data: [1], totalRecord: 1 }));
      const result = await service.getPagination({ page: 1, limit: 10 });
      expect(cache.get).toHaveBeenCalled();
      expect(result.data).toEqual([1]);
    });

    it('lấy từ repository nếu cache không có', async () => {
      cache.get.mockResolvedValue(null);
      repository.findWithPagination.mockResolvedValue({ items: [{ id: '1' }], total: 1 });
      const result = await service.getPagination({ page: 1, limit: 10 });
      expect(repository.findWithPagination).toHaveBeenCalled();
      expect(cache.set).toHaveBeenCalled();
      expect(result.data).toBeDefined();
      expect(result.data![0].id).toBe('1');
    });

    it('throw BadRequest nếu page/limit không hợp lệ', async () => {
      await expect(service.getPagination({ page: 0, limit: 10 })).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.getPagination({ page: 1, limit: 0 })).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.getPagination({ page: 1, limit: 101 })).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.getPagination({ page: 1001, limit: 10 })).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('create', () => {
    it('gọi createdCommon và createImpl', async () => {
      repository.created.mockResolvedValue({ id: '1' });
      await service.create({ id: '1' });
      expect(repository.created).toHaveBeenCalled();
    });

    it('throw Conflict khi duplicate key', async () => {
      repository.created.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });
      await expect(service.create({ id: '1' })).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('update', () => {
    it('update thành công khi entity tồn tại', async () => {
      repository.findOne.mockResolvedValue({ id: '1' });
      repository.updated.mockResolvedValue([1, [{ id: '1', name: 'Updated' }]]);
      const result = await service.update('1', { name: 'Updated' });
      expect(repository.updated).toHaveBeenCalled();
      expect(result).toHaveProperty('id', '1');
    });

    it('throw NotFound khi entity không tồn tại', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update('404', { name: 'X' })).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('getById', () => {
    it('trả về entity khi tồn tại', async () => {
      repository.findOne.mockResolvedValue({ id: '1' });
      const result = await service.getById('1');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('1');
    });

    it('throw NotFound khi không tìm thấy', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.getById('404')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('delete', () => {
    it('xóa entity thành công', async () => {
      repository.deleted.mockResolvedValue(undefined);
      await service.delete('1');
      expect(cache.delCache).toHaveBeenCalled();
      expect(repository.deleted).toHaveBeenCalledWith('1');
    });
  });
});
