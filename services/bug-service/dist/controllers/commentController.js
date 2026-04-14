"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.getComments = void 0;
const client_1 = require("@prisma/client");
const redis_1 = require("../utils/redis");
const prisma = new client_1.PrismaClient();
const getComments = async (req, res) => {
    try {
        const { bugId } = req.params;
        const comments = await prisma.comment.findMany({
            where: { bugId },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        res.json(comments);
    }
    catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getComments = getComments;
const createComment = async (req, res) => {
    try {
        const { bugId } = req.params;
        const { content } = req.body;
        const userId = req.userId;
        if (!content || !content.trim()) {
            res.status(400).json({ error: 'Comment content is required' });
            return;
        }
        // Verify bug exists and get organization ID
        const bug = await prisma.bug.findUnique({
            where: { id: bugId },
            select: { organizationId: true },
        });
        if (!bug) {
            res.status(404).json({ error: 'Bug not found' });
            return;
        }
        const comment = await prisma.comment.create({
            data: {
                content,
                bugId,
                authorId: userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        // Publish real-time notification
        await (0, redis_1.publishNotification)(bug.organizationId, 'comment-added', {
            ...comment,
            bugId,
        });
        res.status(201).json(comment);
    }
    catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createComment = createComment;
