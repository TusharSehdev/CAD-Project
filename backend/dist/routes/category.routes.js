"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const router = (0, express_1.Router)();
exports.categoryRouter = router;
// Get all categories
router.get('/categories', category_controller_1.getCategories);
