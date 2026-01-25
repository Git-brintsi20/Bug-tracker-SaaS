import { Request, Response } from 'express';
import { createBug, getBugs, getBugById, updateBug, deleteBug } from '../../controllers/bugController';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    bug: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

// Mock Redis
jest.mock('../../config/redis', () => ({
  redisClient: {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  },
}));

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
      };

      mockRequest.body = bugData;

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const createdBug = {
        id: 'bug-123',
        ...bugData,
        organizationId: 'org-123',
        creatorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.bug.create as jest.Mock).mockResolvedValue(createdBug);

      await createBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.data).toMatchObject({
        bug: expect.objectContaining({
          id: 'bug-123',
          title: 'Test Bug',
        }),
      });
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
      };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      (prisma.bug.create as jest.Mock).mockRejectedValue(new Error('Database error'));

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

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

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

      (prisma.bug.findMany as jest.Mock).mockResolvedValue(mockBugs);
      (prisma.bug.count as jest.Mock).mockResolvedValue(2);

      await getBugs(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.data.bugs).toHaveLength(2);
      expect(responseObject.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 2,
      });
    });

    it('should filter bugs by status', async () => {
      mockRequest.query = {
        status: 'OPEN',
        organizationId: 'org-123',
      };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      await getBugs(mockRequest as Request, mockResponse as Response);

      expect(prisma.bug.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'OPEN',
          }),
        })
      );
    });
  });

  describe('getBugById', () => {
    it('should return a bug by ID', async () => {
      mockRequest.params = { bugId: 'bug-123' };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const mockBug = {
        id: 'bug-123',
        title: 'Test Bug',
        description: 'Description',
        status: 'OPEN',
        priority: 'HIGH',
        organizationId: 'org-123',
      };

      (prisma.bug.findUnique as jest.Mock).mockResolvedValue(mockBug);

      await getBugById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.data.bug.id).toBe('bug-123');
    });

    it('should return 404 if bug not found', async () => {
      mockRequest.params = { bugId: 'nonexistent' };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      (prisma.bug.findUnique as jest.Mock).mockResolvedValue(null);

      await getBugById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateBug', () => {
    it('should update a bug successfully', async () => {
      mockRequest.params = { bugId: 'bug-123' };
      mockRequest.body = {
        title: 'Updated Title',
        status: 'IN_PROGRESS',
      };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const existingBug = {
        id: 'bug-123',
        organizationId: 'org-123',
      };

      const updatedBug = {
        ...existingBug,
        title: 'Updated Title',
        status: 'IN_PROGRESS',
      };

      (prisma.bug.findUnique as jest.Mock).mockResolvedValue(existingBug);
      (prisma.bug.update as jest.Mock).mockResolvedValue(updatedBug);

      await updateBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.data.bug.title).toBe('Updated Title');
    });

    it('should return 403 if user does not have permission', async () => {
      mockRequest.params = { bugId: 'bug-123' };
      mockRequest.body = { title: 'Updated' };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const existingBug = {
        id: 'bug-123',
        organizationId: 'different-org',
      };

      (prisma.bug.findUnique as jest.Mock).mockResolvedValue(existingBug);

      await updateBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe('deleteBug', () => {
    it('should delete a bug successfully', async () => {
      mockRequest.params = { bugId: 'bug-123' };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const existingBug = {
        id: 'bug-123',
        organizationId: 'org-123',
      };

      (prisma.bug.findUnique as jest.Mock).mockResolvedValue(existingBug);
      (prisma.bug.delete as jest.Mock).mockResolvedValue(existingBug);

      await deleteBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.data.message).toContain('deleted');
    });

    it('should return 404 if bug does not exist', async () => {
      mockRequest.params = { bugId: 'nonexistent' };

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      (prisma.bug.findUnique as jest.Mock).mockResolvedValue(null);

      await deleteBug(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
