"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const exportController_1 = require("../controllers/exportController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Export routes
router.get('/organizations/:organizationId/export/csv', exportController_1.exportBugsCSV);
router.get('/organizations/:organizationId/export/pdf', exportController_1.exportBugsPDF);
exports.default = router;
