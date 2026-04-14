"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const labelController_1 = require("../controllers/labelController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Label management routes
router.get('/organizations/:organizationId/labels', labelController_1.getLabels);
router.post('/organizations/:organizationId/labels', labelController_1.createLabel);
router.put('/organizations/:organizationId/labels/:labelId', labelController_1.updateLabel);
router.delete('/organizations/:organizationId/labels/:labelId', labelController_1.deleteLabel);
// Bug-label association routes
router.post('/bugs/:bugId/labels/:labelId', labelController_1.addLabelToBug);
router.delete('/bugs/:bugId/labels/:labelId', labelController_1.removeLabelFromBug);
exports.default = router;
