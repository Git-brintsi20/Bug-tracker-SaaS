import { Request, Response } from 'express';
import { bulkUpdateStatus, bulkUpdatePriority, bulkAssign, bulkDelete } from '../../controllers/bulkController';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    bug: {
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

jest.mock('../../config/redis', () => ({
  redisClient: {
    keys: jest.fn().mockResolvedValue([]),
    del: jest.fn(),
  },
}));

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
  });

  describe('bulkUpdateStatus', () => {
    it('should update status for multiple bugs', async () => {
      mockRequest.body = {
        bugIds: ['bug-1', 'bug-2', 'bug-3'],
        status: 'IN_PROGRESS',
      };
      mockRequest.params = { organizationId: 'org-123' };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      (prisma.bug.updateMany as jest.Mock).mockResolvedValue({ count: 3 });

      await bulkUpdateStatus(mockRequest as Request, mockResponse as Response);

      expect(prisma.bug.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['bug-1', 'bug-2', 'bug-3'] },
          organizationId: 'org-123',
        },
        data: { status: 'IN_PROGRESS' },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.updatedCount).toBe(3);
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

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      (prisma.bug.updateMany as jest.Mock).mockResolvedValue({ count: 2 });

      await bulkUpdatePriority(mockRequest as Request, mockResponse as Response);

      expect(prisma.bug.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['bug-1', 'bug-2'] },
          organizationId: 'org-123',
        },
        data: { priority: 'HIGH' },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
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

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      (prisma.bug.updateMany as jest.Mock).mockResolvedValue({ count: 2 });

      await bulkAssign(mockRequest as Request, mockResponse as Response);

      expect(prisma.bug.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['bug-1', 'bug-2'] },
          organizationId: 'org-123',
        },
        data: { assigneeId: 'user-456' },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple bugs', async () => {
      mockRequest.body = {
        bugIds: ['bug-1', 'bug-2', 'bug-3'],
      };
      mockRequest.params = { organizationId: 'org-123' };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      (prisma.bug.deleteMany as jest.Mock).mockResolvedValue({ count: 3 });

      await bulkDelete(mockRequest as Request, mockResponse as Response);

      expect(prisma.bug.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['bug-1', 'bug-2', 'bug-3'] },
          organizationId: 'org-123',
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.deletedCount).toBe(3);
    });

    it('should return error if no bugs deleted', async () => {
      mockRequest.body = {
        bugIds: ['nonexistent'],
      };
      mockRequest.params = { organizationId: 'org-123' };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      (prisma.bug.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });

      await bulkDelete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
