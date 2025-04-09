"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockById = exports.getBlocks = void 0;
const models_1 = require("../models");
// Get all blocks with pagination and filtering
const getBlocks = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : undefined;
        const fileId = req.query.fileId ? parseInt(req.query.fileId) : undefined;
        // Filter blocks
        let filteredBlocks = [...models_1.blocks];
        if (search) {
            filteredBlocks = filteredBlocks.filter(block => block.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (categoryId) {
            filteredBlocks = filteredBlocks.filter(block => parseInt(block.category) === categoryId);
        }
        // In a real implementation, blocks would have a fileId field
        // For this mock, we'll just use random filtering if a fileId is specified
        if (fileId) {
            filteredBlocks = filteredBlocks.filter(() => Math.random() > 0.5);
        }
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedBlocks = filteredBlocks.slice(startIndex, endIndex);
        res.status(200).json({
            page,
            limit,
            total: filteredBlocks.length,
            totalPages: Math.ceil(filteredBlocks.length / limit),
            blocks: paginatedBlocks
        });
    }
    catch (error) {
        console.error('Error getting blocks:', error);
        res.status(500).json({ error: 'Error getting blocks' });
    }
};
exports.getBlocks = getBlocks;
// Get a block by ID
const getBlockById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const block = models_1.blocks.find(b => b.id === id);
        if (!block) {
            res.status(404).json({ error: 'Block not found' });
            return;
        }
        res.status(200).json(block);
    }
    catch (error) {
        console.error('Error getting block:', error);
        res.status(500).json({ error: 'Error getting block' });
    }
};
exports.getBlockById = getBlockById;
