// Mock Prisma Client before importing
const mockBugCreate = jest.fn();
const mockBugFindMany = jest.fn();
const mockBugFindUnique = jest.fn();
const mockBugUpdate = jest.fn();
const mockBugDelete = jest.fn();
const mockBugCount = jest.fn();

jest.mock('../../../../../prisma/node_modules/@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    bug: {
      create: mockBugCreate,
      findMany: mockBugFindMany,
      findUnique: mockBugFindUnique,
      update: mockBugUpdate,
      delete: mockBugDelete,
      count: mockBugCount,
    },
  })),
}));

// Mock Redis
const mockGetCache = jest.fn();
const mockSetCache = jest.fn();
const mockDeleteCachePattern = jest.fn();

jest.mock('../../utils/redis', () => ({
  getCache: mockGetCache,
  setCache: mockSetCache,
  deleteCachePattern: mockDeleteCachePattern,
}));

import { Request, Response } from 'express';
import { createBug, getBugs, getBugById, updateBug, deleteBug } from '../../controllers/bugController';

describe('Bug Controller', () => {
  let mockRequest: any;
  let mockResponse: any;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { userId: 'user-123', organizationId: 'org-123' },
    };
    responseObject = {
      status: 200,
      data: null,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data: any) => {
        responseObject.data = data;
        return mockResponse;
      }) as any,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBug', () => {
    it('should create a new bug successfully', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test Description',
        priority: 'HIGH',
        status: 'OPEN',
        organizationId: 'org-123',
      };

      mockRequest.body = bugData;

      const createdBug = {
        id: 'bug-123',
        ...bugData,
        creatorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBugCreate.mockResolvedValue(createdBug);
      mockDeleteCachePattern.mockResolvedValue(undefined);

      await createBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockBugCreate).toHaveBeenCalled();
    });

    it('should return 400 for invalid bug data', async () => {
      mockRequest.body = {
        title: '', // Invalid: empty title
      };

      await createBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 500 on database error', async () => {
      mockRequest.body = {
        title: 'Test Bug',
        description: 'Test',
        priority: 'HIGH',
        status: 'OPEN',
        organizationId: 'org-123',
      };

      mockBugCreate.mockRejectedValue(new Error('Database error'));

      await createBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getBugs', () => {
    it('should return paginated bugs', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10',
        organizationId: 'org-123',
      };

      const mockBugs = [
        {
          id: 'bug-1',
          title: 'Bug 1',
          status: 'OPEN',
          priority: 'HIGH',
          createdAt: new Date(),
        },
        {
          id: 'bug-2',
          title: 'Bug 2',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          createdAt: new Date(),
        },
      ];

      mockGetCache.mockResolvedValue(null);
      mockBugFindMany.mockResolvedValue(mockBugs);
      mockBugCount.mockResolvedValue(2);
      mockSetCache.mockResolvedValue(undefined);

      await getBugs(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should filter bugs by status', async () => {
      mockRequest.query = {
        status: 'OPEN',
        organizationId: 'org-123',
      };

      mockGetCache.mockResolvedValue(null);
      mockBugFindMany.mockResolvedValue([]);
      mockBugCount.mockResolvedValue(0);

      await getBugs(mockRequest as Request, mockResponse as Response);

      expect(mockBugFindMany).toHaveBeenCalled();
    });
  });

  describe('getBugById', () => {
    it('should return a bug by ID', async () => {
      mockRequest.params = { bugId: 'bug-123' };

      const mockBug = {
        id: 'bug-123',
        title: 'Test Bug',
        description: 'Description',
        status: 'OPEN',
        priority: 'HIGH',
        organizationId: 'org-123',
      };

      mockGetCache.mockResolvedValue(null);
      mockBugFindUnique.mockResolvedValue(mockBug);
      mockSetCache.mockResolvedValue(undefined);

      await getBugById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if bug not found', async () => {
      mockRequest.params = { bugId: 'nonexistent' };

      mockGetCache.mockResolvedValue(null);
      mockBugFindUnique.mockResolvedValue(null);

      await getBugById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateBug', () => {
    it('should update a bug successfully', async () => {
      mockRequest.params = { id: 'bug-123' };
      mockRequest.body = {
        title: 'Updated Title',
        status: 'IN_PROGRESS',
      };

      const updatedBug = {
        id: 'bug-123',
        title: 'Updated Title',
        status: 'IN_PROGRESS',
        organizationId: 'org-123',
      };

      mockBugUpdate.mockResolvedValue(updatedBug);
      mockDeleteCachePattern.mockResolvedValue(undefined);

      await updateBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 on error', async () => {
      mockRequest.params = { id: 'bug-123' };
      mockRequest.body = { title: 'Updated' };

      mockBugUpdate.mockRejectedValue(new Error('Update failed'));

      await updateBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteBug', () => {
    it('should delete a bug successfully', async () => {
      mockRequest.params = { id: 'bug-123' };

      const deletedBug = {
        id: 'bug-123',
        organizationId: 'org-123',
      };

      mockBugDelete.mockResolvedValue(deletedBug);
      mockDeleteCachePattern.mockResolvedValue(undefined);

      await deleteBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 on error', async () => {
      mockRequest.params = { id: 'nonexistent' };

      mockBugDelete.mockRejectedValue(new Error('Not found'));

      await deleteBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
