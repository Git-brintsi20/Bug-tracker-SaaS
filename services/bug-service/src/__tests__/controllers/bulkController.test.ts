// Mock Prisma Client before importing
const mockBugUpdateMany = jest.fn();
const mockBugDeleteMany = jest.fn();
const mockBugFindMany = jest.fn();
const mockBugFindUnique = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    bug: {
      updateMany: mockBugUpdateMany,
      deleteMany: mockBugDeleteMany,
      findMany: mockBugFindMany,
    },
    user: {
      findUnique: mockBugFindUnique,
    },
  })),
}));

// Mock Redis
const mockDeleteCachePattern = jest.fn();

jest.mock('../../utils/redis', () => ({
  deleteCachePattern: mockDeleteCachePattern,
}));

import { Request, Response } from 'express';
import { bulkUpdateStatus, bulkUpdatePriority, bulkAssign, bulkDelete } from '../../controllers/bulkController';

describe('Bulk Operations Controller', () => {
  let mockRequest: any;
  let mockResponse: any;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      user: { userId: 'user-123', organizationId: 'org-123' },
    };
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data: any) => {
        responseObject = data;
        return mockResponse;
      }) as any,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockBugFindMany.mockResolvedValue([]);
    mockBugFindUnique.mockResolvedValue({ id: 'user-123' });
    mockDeleteCachePattern.mockResolvedValue(undefined);
  });

  describe('bulkUpdateStatus', () => {
    it('should update status for multiple bugs', async () => {
      mockRequest.body = {
        bugIds: ['bug-1', 'bug-2', 'bug-3'],
        status: 'IN_PROGRESS',
      };
      mockRequest.params = { organizationId: 'org-123' };

      mockBugUpdateMany.mockResolvedValue({ count: 3 });
      mockBugFindMany.mockResolvedValue([
        { organizationId: 'org-123' },
        { organizationId: 'org-123' },
        { organizationId: 'org-123' },
      ]);
      mockDeleteCachePattern.mockResolvedValue(undefined);

      await bulkUpdateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockBugUpdateMany).toHaveBeenCalled();
      expect(mockBugFindMany).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
      expect(responseObject.count).toBe(3);
    });

    it('should validate status enum', async () => {
      mockRequest.body = {
        bugIds: ['bug-1'],
        status: 'INVALID_STATUS',
      };
      mockRequest.params = { organizationId: 'org-123' };

      await bulkUpdateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.error).toContain('Invalid status');
    });

    it('should require bugIds array', async () => {
      mockRequest.body = {
        status: 'OPEN',
      };
      mockRequest.params = { organizationId: 'org-123' };

      await bulkUpdateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('bulkUpdatePriority', () => {
    it('should update priority for multiple bugs', async () => {
      mockRequest.body = {
        bugIds: ['bug-1', 'bug-2'],
        priority: 'HIGH',
      };
      mockRequest.params = { organizationId: 'org-123' };

      mockBugUpdateMany.mockResolvedValue({ count: 2 });
      mockBugFindMany.mockResolvedValue([
        { organizationId: 'org-123' },
        { organizationId: 'org-123' },
      ]);
      mockDeleteCachePattern.mockResolvedValue(undefined);

      await bulkUpdatePriority(mockRequest as Request, mockResponse as Response);

      expect(mockBugUpdateMany).toHaveBeenCalled();
      expect(mockBugFindMany).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should validate priority enum', async () => {
      mockRequest.body = {
        bugIds: ['bug-1'],
        priority: 'INVALID_PRIORITY',
      };
      mockRequest.params = { organizationId: 'org-123' };

      await bulkUpdatePriority(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('bulkAssign', () => {
    it('should assign multiple bugs to a user', async () => {
      mockRequest.body = {
        bugIds: ['bug-1', 'bug-2'],
        assigneeId: 'user-456',
      };
      mockRequest.params = { organizationId: 'org-123' };

      mockBugFindUnique.mockResolvedValue({ id: 'user-456' });
      mockBugUpdateMany.mockResolvedValue({ count: 2 });
      mockBugFindMany.mockResolvedValue([
        { organizationId: 'org-123' },
        { organizationId: 'org-123' },
      ]);
      mockDeleteCachePattern.mockResolvedValue(undefined);

      await bulkAssign(mockRequest as Request, mockResponse as Response);

      expect(mockBugFindUnique).toHaveBeenCalled();
      expect(mockBugUpdateMany).toHaveBeenCalled();
      expect(mockBugFindMany).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple bugs', async () => {
      mockRequest.body = {
        bugIds: ['bug-1', 'bug-2', 'bug-3'],
      };
      mockRequest.params = { organizationId: 'org-123' };

      mockBugFindMany.mockResolvedValue([
        { organizationId: 'org-123' },
        { organizationId: 'org-123' },
        { organizationId: 'org-123' },
      ]);
      mockBugDeleteMany.mockResolvedValue({ count: 3 });
      mockDeleteCachePattern.mockResolvedValue(undefined);

      await bulkDelete(mockRequest as Request, mockResponse as Response);

      expect(mockBugFindMany).toHaveBeenCalled();
      expect(mockBugDeleteMany).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
      expect(responseObject.count).toBe(3);
    });

    it('should return error if no bugs deleted', async () => {
      mockRequest.body = {
        bugIds: ['nonexistent'],
      };
      mockRequest.params = { organizationId: 'org-123' };

      mockBugFindMany.mockResolvedValue([]);
      mockBugDeleteMany.mockResolvedValue({ count: 0 });

      await bulkDelete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalled();
      expect(responseObject.count).toBe(0);
    });
  });
});
