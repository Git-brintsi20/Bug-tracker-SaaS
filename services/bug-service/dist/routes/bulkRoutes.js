"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const bulkController_1 = require("../controllers/bulkController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Bulk operations routes
router.post('/bugs/bulk/status', bulkController_1.bulkUpdateStatus);
router.post('/bugs/bulk/priority', bulkController_1.bulkUpdatePriority);
router.post('/bugs/bulk/assign', bulkController_1.bulkAssign);
router.post('/bugs/bulk/delete', bulkController_1.bulkDelete);
router.post('/bugs/bulk/labels', bulkController_1.bulkAddLabels);
exports.default = router;
