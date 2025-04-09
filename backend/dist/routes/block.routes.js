"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockRouter = void 0;
const express_1 = require("express");
const block_controller_1 = require("../controllers/block.controller");
const router = (0, express_1.Router)();
exports.blockRouter = router;
// Get all blocks
router.get('/blocks', block_controller_1.getBlocks);
// Get a block by ID
router.get('/blocks/:id', block_controller_1.getBlockById);
