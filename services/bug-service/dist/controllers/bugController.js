"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBug = exports.updateBug = exports.createBug = exports.getBugById = exports.getBugs = void 0;
const client_1 = require("@prisma/client");
const redis_1 = require("../utils/redis");
const prisma = new client_1.PrismaClient();
const getBugs = async (req, res) => {
    try {
        const { organizationId, status, priority, assignee, dateFrom, dateTo } = req.query;
        const cacheKey = `bugs:${organizationId || 'all'}:${status || 'all'}:${priority || 'all'}:${assignee || 'all'}:${dateFrom || 'all'}:${dateTo || 'all'}`;
        // Check cache
        const cached = await (0, redis_1.getCache)(cacheKey);
        if (cached) {
            res.json(JSON.parse(cached));
            return;
        }
        const whereClause = {};
        // Organization filter (required)
        if (organizationId)
            whereClause.organizationId = organizationId;
        // Status filter (single or multiple)
        if (status) {
            const statuses = status.split(',');
            if (statuses.length > 1) {
                whereClause.status = { in: statuses };
            }
            else {
                whereClause.status = statuses[0];
            }
        }
        // Priority filter (single or multiple)
        if (priority) {
            const priorities = priority.split(',');
            if (priorities.length > 1) {
                whereClause.priority = { in: priorities };
            }
            else {
                whereClause.priority = priorities[0];
            }
        }
        // Assignee filter (specific user or unassigned)
        if (assignee) {
            if (assignee === 'null') {
                whereClause.assigneeId = null;
            }
            else {
                whereClause.assigneeId = assignee;
            }
        }
        // Date range filter
        if (dateFrom || dateTo) {
            whereClause.createdAt = {};
            if (dateFrom)
                whereClause.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                whereClause.createdAt.lte = new Date(dateTo);
        }
        const bugs = await prisma.bug.findMany({
            where: whereClause,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                labels: true,
                _count: {
                    select: {
                        comments: true,
                        attachments: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        await (0, redis_1.setCache)(cacheKey, JSON.stringify(bugs));
        res.json(bugs);
    }
    catch (error) {
        console.error('Get bugs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getBugs = getBugs;
const getBugById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `bug:${id}`;
        const cached = await (0, redis_1.getCache)(cacheKey);
        if (cached) {
            res.json(JSON.parse(cached));
            return;
        }
        const bug = await prisma.bug.findUnique({
            where: { id },
            include: {
                creator: true,
                assignee: true,
                organization: true,
                labels: true,
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
                attachments: true,
            },
        });
        if (!bug) {
            res.status(404).json({ error: 'Bug not found' });
            return;
        }
        await (0, redis_1.setCache)(cacheKey, JSON.stringify(bug));
        res.json(bug);
    }
    catch (error) {
        console.error('Get bug error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getBugById = getBugById;
const createBug = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, description, priority, organizationId, assigneeId, labelIds } = req.body;
        if (!title || !organizationId) {
            res.status(400).json({ error: 'Title and organizationId are required' });
            return;
        }
        const bug = await prisma.bug.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                status: 'OPEN',
                creatorId: userId,
                organizationId,
                assigneeId,
                ...(labelIds && labelIds.length > 0 && {
                    labels: {
                        connect: labelIds.map((id) => ({ id })),
                    },
                }),
            },
            include: {
                creator: true,
                assignee: true,
                labels: true,
            },
        });
        await (0, redis_1.deleteCachePattern)(`bugs:${organizationId}:*`);
        // Publish real-time notification
        const { publishNotification } = await import('../utils/redis.js');
        await publishNotification(organizationId, 'bug-created', bug);
        res.status(201).json(bug);
    }
    catch (error) {
        console.error('Create bug error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createBug = createBug;
const updateBug = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, assigneeId } = req.body;
        const bug = await prisma.bug.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status }),
                ...(priority && { priority }),
                ...(assigneeId !== undefined && { assigneeId }),
            },
            include: {
                creator: true,
                assignee: true,
                labels: true,
            },
        });
        await (0, redis_1.deleteCachePattern)(`bug:${id}`);
        await (0, redis_1.deleteCachePattern)(`bugs:${bug.organizationId}:*`);
        // Publish real-time notification
        const { publishNotification } = await import('../utils/redis.js');
        await publishNotification(bug.organizationId, 'bug-updated', bug);
        res.json(bug);
    }
    catch (error) {
        console.error('Update bug error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateBug = updateBug;
const deleteBug = async (req, res) => {
    try {
        const { id } = req.params;
        const bug = await prisma.bug.delete({
            where: { id },
        });
        await (0, redis_1.deleteCachePattern)(`bug:${id}`);
        await (0, redis_1.deleteCachePattern)(`bugs:${bug.organizationId}:*`);
        // Publish real-time notification
        const { publishNotification } = await import('../utils/redis.js');
        await publishNotification(bug.organizationId, 'bug-deleted', { id });
        res.json({ message: 'Bug deleted successfully' });
    }
    catch (error) {
        console.error('Delete bug error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteBug = deleteBug;
