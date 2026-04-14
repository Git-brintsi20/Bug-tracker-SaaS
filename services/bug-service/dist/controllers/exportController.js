"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportBugsPDF = exports.exportBugsCSV = void 0;
const client_1 = require("@prisma/client");
const { Parser } = require('json2csv');
const pdfkit_1 = __importDefault(require("pdfkit"));
const prisma = new client_1.PrismaClient();
// Export bugs as CSV
const exportBugsCSV = async (req, res) => {
    try {
        const { organizationId } = req.params;
        const { status, priority, assigneeId } = req.query;
        // Build filter
        const where = { organizationId };
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        if (assigneeId)
            where.assigneeId = assigneeId;
        // Fetch bugs
        const bugs = await prisma.bug.findMany({
            where,
            include: {
                creator: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                labels: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        // Transform data for CSV
        const csvData = bugs.map(bug => ({
            ID: bug.id,
            Title: bug.title,
            Description: bug.description || '',
            Status: bug.status,
            Priority: bug.priority,
            Creator: bug.creator ? `${bug.creator.firstName} ${bug.creator.lastName}` : '',
            'Creator Email': bug.creator?.email || '',
            Assignee: bug.assignee ? `${bug.assignee.firstName} ${bug.assignee.lastName}` : 'Unassigned',
            'Assignee Email': bug.assignee?.email || '',
            Labels: bug.labels.map(l => l.name).join(', '),
            Created: new Date(bug.createdAt).toLocaleString(),
            Updated: new Date(bug.updatedAt).toLocaleString(),
        }));
        // Convert to CSV
        const parser = new Parser();
        const csv = parser.parse(csvData);
        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=bugs-export-${Date.now()}.csv`);
        res.send(csv);
    }
    catch (error) {
        console.error('Export CSV error:', error);
        res.status(500).json({ error: 'Failed to export bugs as CSV' });
    }
};
exports.exportBugsCSV = exportBugsCSV;
// Export bugs as PDF
const exportBugsPDF = async (req, res) => {
    try {
        const { organizationId } = req.params;
        const { status, priority, assigneeId } = req.query;
        // Build filter
        const where = { organizationId };
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        if (assigneeId)
            where.assigneeId = assigneeId;
        // Fetch organization and bugs
        const [organization, bugs] = await Promise.all([
            prisma.organization.findUnique({
                where: { id: organizationId },
            }),
            prisma.bug.findMany({
                where,
                include: {
                    creator: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    assignee: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    labels: {
                        select: {
                            name: true,
                            color: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        if (!organization) {
            res.status(404).json({ error: 'Organization not found' });
            return;
        }
        // Create PDF document
        const doc = new pdfkit_1.default({ margin: 50 });
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bugs-report-${Date.now()}.pdf`);
        // Pipe PDF to response
        doc.pipe(res);
        // Add title
        doc.fontSize(20).text(`Bug Report - ${organization.name}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);
        // Add summary statistics
        const statusCounts = bugs.reduce((acc, bug) => {
            acc[bug.status] = (acc[bug.status] || 0) + 1;
            return acc;
        }, {});
        const priorityCounts = bugs.reduce((acc, bug) => {
            acc[bug.priority] = (acc[bug.priority] || 0) + 1;
            return acc;
        }, {});
        doc.fontSize(14).text('Summary Statistics', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);
        doc.text(`Total Bugs: ${bugs.length}`);
        doc.text(`Status Breakdown:`);
        Object.entries(statusCounts).forEach(([status, count]) => {
            doc.text(`  • ${status}: ${count}`, { indent: 20 });
        });
        doc.text(`Priority Breakdown:`);
        Object.entries(priorityCounts).forEach(([priority, count]) => {
            doc.text(`  • ${priority}: ${count}`, { indent: 20 });
        });
        doc.moveDown(2);
        // Add bug details
        doc.fontSize(14).text('Bug Details', { underline: true });
        doc.moveDown();
        bugs.forEach((bug, index) => {
            // Check if we need a new page
            if (doc.y > 700) {
                doc.addPage();
            }
            doc.fontSize(12).fillColor('#000000').text(`${index + 1}. ${bug.title}`);
            doc.fontSize(10).fillColor('#333333');
            doc.text(`ID: ${bug.id}`);
            doc.text(`Status: ${bug.status} | Priority: ${bug.priority}`);
            doc.text(`Creator: ${bug.creator ? `${bug.creator.firstName} ${bug.creator.lastName}` : 'Unknown'}`);
            doc.text(`Assignee: ${bug.assignee ? `${bug.assignee.firstName} ${bug.assignee.lastName}` : 'Unassigned'}`);
            if (bug.labels.length > 0) {
                doc.text(`Labels: ${bug.labels.map(l => l.name).join(', ')}`);
            }
            if (bug.description) {
                doc.text(`Description: ${bug.description.substring(0, 200)}${bug.description.length > 200 ? '...' : ''}`);
            }
            doc.text(`Created: ${new Date(bug.createdAt).toLocaleDateString()}`);
            doc.moveDown();
        });
        // Finalize PDF
        doc.end();
    }
    catch (error) {
        console.error('Export PDF error:', error);
        res.status(500).json({ error: 'Failed to export bugs as PDF' });
    }
};
exports.exportBugsPDF = exportBugsPDF;
