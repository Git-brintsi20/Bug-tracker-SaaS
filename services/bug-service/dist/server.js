"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const bugRoutes_1 = __importDefault(require("./routes/bugRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const labelRoutes_1 = __importDefault(require("./routes/labelRoutes"));
const attachmentRoutes_1 = __importDefault(require("./routes/attachmentRoutes"));
const exportRoutes_1 = __importDefault(require("./routes/exportRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const bulkRoutes_1 = __importDefault(require("./routes/bulkRoutes"));
const redis_1 = require("./utils/redis");
const auth_1 = require("./middleware/auth");
const statisticsController_1 = require("./controllers/statisticsController");
// Load service-local environment and override any inherited global variables.
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env'), override: true });
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5002');
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'bug-service' });
});
// Organization-level routes
app.get('/api/organizations/:organizationId/bugs', auth_1.authenticate, async (req, res) => {
    // Inject organizationId into query parameters
    req.query.organizationId = req.params.organizationId;
    // Import and call getBugs handler
    const { getBugs } = await import('./controllers/bugController.js');
    return getBugs(req, res);
});
app.get('/api/organizations/:organizationId/bugs/statistics', auth_1.authenticate, async (req, res) => {
    req.query.organizationId = req.params.organizationId;
    return (0, statisticsController_1.getStatistics)(req, res);
});
app.post('/api/organizations/:organizationId/bugs/bulk/status', auth_1.authenticate, async (req, res) => {
    req.body.organizationId = req.params.organizationId;
    const { bulkUpdateStatus } = await import('./controllers/bulkController.js');
    return bulkUpdateStatus(req, res);
});
app.post('/api/organizations/:organizationId/bugs/bulk/priority', auth_1.authenticate, async (req, res) => {
    req.body.organizationId = req.params.organizationId;
    const { bulkUpdatePriority } = await import('./controllers/bulkController.js');
    return bulkUpdatePriority(req, res);
});
app.post('/api/organizations/:organizationId/bugs/bulk/assign', auth_1.authenticate, async (req, res) => {
    req.body.organizationId = req.params.organizationId;
    const { bulkAssign } = await import('./controllers/bulkController.js');
    return bulkAssign(req, res);
});
app.post('/api/organizations/:organizationId/bugs/bulk/labels', auth_1.authenticate, async (req, res) => {
    req.body.organizationId = req.params.organizationId;
    const { bulkAddLabels } = await import('./controllers/bulkController.js');
    return bulkAddLabels(req, res);
});
app.post('/api/organizations/:organizationId/bugs/bulk/delete', auth_1.authenticate, async (req, res) => {
    req.body.organizationId = req.params.organizationId;
    const { bulkDelete } = await import('./controllers/bulkController.js');
    return bulkDelete(req, res);
});
app.use('/api/bugs', bugRoutes_1.default);
app.use('/api/bugs/:bugId/comments', commentRoutes_1.default);
app.use('/api/bugs/:bugId/attachments', attachmentRoutes_1.default);
app.use('/api', labelRoutes_1.default);
app.use('/api', exportRoutes_1.default);
app.use('/api', searchRoutes_1.default);
app.use('/api', bulkRoutes_1.default);
app.get('/api/statistics', auth_1.authenticate, statisticsController_1.getStatistics);
// Serve uploaded files statically
app.use('/uploads', express_1.default.static('uploads'));
// Start server FIRST (so Render health check sees the port), then connect Redis in background
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐛 Bug Service running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
});
// Non-blocking: Redis connects in background, cache ops are fail-safe
(0, redis_1.connectRedis)();
