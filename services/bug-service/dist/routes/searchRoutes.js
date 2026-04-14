"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const searchController_1 = require("../controllers/searchController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Search routes
router.get('/organizations/:organizationId/search', searchController_1.searchBugs);
router.get('/organizations/:organizationId/search/suggestions', searchController_1.getSearchSuggestions);
exports.default = router;
