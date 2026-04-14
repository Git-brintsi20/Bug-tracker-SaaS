"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkAddLabels = exports.bulkDelete = exports.bulkAssign = exports.bulkUpdatePriority = exports.bulkUpdateStatus = void 0;
const client_1 = require("@prisma/client");
const redis_1 = require("../utils/redis");
const prisma = new client_1.PrismaClient();
// Bulk update bug status
const bulkUpdateStatus = async (req, res) => {
    try {
        const { bugIds, status } = req.body;
        // Validate input
        if (!bugIds || !Array.isArray(bugIds) || bugIds.length === 0) {
            res.status(400).json({ error: 'bugIds array is required' });
            return;
        }
        if (!status) {
            res.status(400).json({ error: 'status is required' });
            return;
        }
        // Validate status
        const validStatuses = ['OPEN', 'IN_PROGRESS', 'REVIEW', 'RESOLVED', 'CLOSED'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }
        // Update bugs
        const result = await prisma.bug.updateMany({
            where: {
                id: { in: bugIds },
            },
            data: {
                status,
            },
        });
        // Invalidate cache for all affected organizations
        const bugs = await prisma.bug.findMany({
            where: { id: { in: bugIds } },
            select: { organizationId: true },
        });
        const orgIds = [...new Set(bugs.map(b => b.organizationId))];
        for (const orgId of orgIds) {
            await (0, redis_1.deleteCachePattern)(`bugs:*${orgId}*`);
        }
        res.json({
            message: `${result.count} bug(s) updated successfully`,
            count: result.count,
        });
    }
    catch (error) {
        console.error('Bulk update status error:', error);
        res.status(500).json({ error: 'Failed to update bug statuses' });
    }
};
exports.bulkUpdateStatus = bulkUpdateStatus;
// Bulk update bug priority
const bulkUpdatePriority = async (req, res) => {
    try {
        const { bugIds, priority } = req.body;
        // Validate input
        if (!bugIds || !Array.isArray(bugIds) || bugIds.length === 0) {
            res.status(400).json({ error: 'bugIds array is required' });
            return;
        }
        if (!priority) {
            res.status(400).json({ error: 'priority is required' });
            return;
        }
        // Validate priority
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        if (!validPriorities.includes(priority)) {
            res.status(400).json({ error: 'Invalid priority' });
            return;
        }
        // Update bugs
        const result = await prisma.bug.updateMany({
            where: {
                id: { in: bugIds },
            },
            data: {
                priority,
            },
        });
        // Invalidate cache
        const bugs = await prisma.bug.findMany({
            where: { id: { in: bugIds } },
            select: { organizationId: true },
        });
        const orgIds = [...new Set(bugs.map(b => b.organizationId))];
        for (const orgId of orgIds) {
            await (0, redis_1.deleteCachePattern)(`bugs:org:${orgId}:*`);
        }
        res.json({
            message: `${result.count} bug(s) updated successfully`,
            count: result.count,
        });
    }
    catch (error) {
        console.error('Bulk update priority error:', error);
        res.status(500).json({ error: 'Failed to update bug priorities' });
    }
};
exports.bulkUpdatePriority = bulkUpdatePriority;
// Bulk assign bugs
const bulkAssign = async (req, res) => {
    try {
        const { bugIds, assigneeId } = req.body;
        // Validate input
        if (!bugIds || !Array.isArray(bugIds) || bugIds.length === 0) {
            res.status(400).json({ error: 'bugIds array is required' });
            return;
        }
        if (!assigneeId) {
            res.status(400).json({ error: 'assigneeId is required' });
            return;
        }
        // Verify assignee exists
        const assignee = await prisma.user.findUnique({
            where: { id: assigneeId },
        });
        if (!assignee) {
            res.status(404).json({ error: 'Assignee not found' });
            return;
        }
        // Update bugs
        const result = await prisma.bug.updateMany({
            where: {
                id: { in: bugIds },
            },
            data: {
                assigneeId,
            },
        });
        // Invalidate cache
        const bugs = await prisma.bug.findMany({
            where: { id: { in: bugIds } },
            select: { organizationId: true },
        });
        const orgIds = [...new Set(bugs.map(b => b.organizationId))];
        for (const orgId of orgIds) {
            await (0, redis_1.deleteCachePattern)(`bugs:*${orgId}*`);
        }
        res.json({
            message: `${result.count} bug(s) assigned successfully`,
            count: result.count,
        });
    }
    catch (error) {
        console.error('Bulk assign error:', error);
        res.status(500).json({ error: 'Failed to assign bugs' });
    }
};
exports.bulkAssign = bulkAssign;
// Bulk delete bugs
const bulkDelete = async (req, res) => {
    try {
        const { bugIds } = req.body;
        // Validate input
        if (!bugIds || !Array.isArray(bugIds) || bugIds.length === 0) {
            res.status(400).json({ error: 'bugIds array is required' });
            return;
        }
        // Get organization IDs before deletion for cache invalidation
        const bugs = await prisma.bug.findMany({
            where: { id: { in: bugIds } },
            select: { organizationId: true },
        });
        const orgIds = [...new Set(bugs.map(b => b.organizationId))];
        // Delete bugs (cascade will handle comments, attachments, etc.)
        const result = await prisma.bug.deleteMany({
            where: {
                id: { in: bugIds },
            },
        });
        // Invalidate cache
        for (const orgId of orgIds) {
            await (0, redis_1.deleteCachePattern)(`bugs:*${orgId}*`);
        }
        res.json({
            message: `${result.count} bug(s) deleted successfully`,
            count: result.count,
        });
    }
    catch (error) {
        console.error('Bulk delete error:', error);
        res.status(500).json({ error: 'Failed to delete bugs' });
    }
};
exports.bulkDelete = bulkDelete;
// Bulk add labels
const bulkAddLabels = async (req, res) => {
    try {
        const { bugIds, labelIds } = req.body;
        // Validate input
        if (!bugIds || !Array.isArray(bugIds) || bugIds.length === 0) {
            res.status(400).json({ error: 'bugIds array is required' });
            return;
        }
        if (!labelIds || !Array.isArray(labelIds) || labelIds.length === 0) {
            res.status(400).json({ error: 'labelIds array is required' });
            return;
        }
        // Add labels to each bug
        for (const bugId of bugIds) {
            await prisma.bug.update({
                where: { id: bugId },
                data: {
                    labels: {
                        connect: labelIds.map(id => ({ id })),
                    },
                },
            });
        }
        // Invalidate cache
        const bugs = await prisma.bug.findMany({
            where: { id: { in: bugIds } },
            select: { organizationId: true },
        });
        const orgIds = [...new Set(bugs.map(b => b.organizationId))];
        for (const orgId of orgIds) {
            await (0, redis_1.deleteCachePattern)(`bugs:*${orgId}*`);
        }
        res.json({
            message: `Labels added to ${bugIds.length} bug(s) successfully`,
            count: bugIds.length,
        });
    }
    catch (error) {
        console.error('Bulk add labels error:', error);
        res.status(500).json({ error: 'Failed to add labels to bugs' });
    }
};
exports.bulkAddLabels = bulkAddLabels;
