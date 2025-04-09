"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileById = exports.getFiles = exports.uploadFile = void 0;
const models_1 = require("../models");
const upload_1 = require("../utils/upload");
// Upload a file and parse CAD blocks
const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        // Add file to our "database"
        const newFile = {
            id: (0, models_1.getNextId)(models_1.files),
            name: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            type: req.file.mimetype,
            uploadedAt: new Date()
        };
        models_1.files.push(newFile);
        // Parse the CAD file (mock)
        const parsedBlocks = (0, upload_1.parseCadFile)(req.file.path);
        // Add blocks to our "database"
        const newBlocks = parsedBlocks.map(block => ({
            id: (0, models_1.getNextId)(models_1.blocks),
            name: block.name,
            category: block.category,
            properties: block.properties
        }));
        models_1.blocks.push(...newBlocks);
        res.status(200).json({
            message: 'File uploaded successfully',
            filename: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype,
            blocks: newBlocks
        });
    }
    catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
};
exports.uploadFile = uploadFile;
// Get all files with pagination
const getFiles = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedFiles = models_1.files.slice(startIndex, endIndex);
        res.status(200).json({
            page,
            limit,
            total: models_1.files.length,
            totalPages: Math.ceil(models_1.files.length / limit),
            files: paginatedFiles
        });
    }
    catch (error) {
        console.error('Error getting files:', error);
        res.status(500).json({ error: 'Error getting files' });
    }
};
exports.getFiles = getFiles;
// Get a file by ID
const getFileById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const file = models_1.files.find(f => f.id === id);
        if (!file) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
        res.status(200).json(file);
    }
    catch (error) {
        console.error('Error getting file:', error);
        res.status(500).json({ error: 'Error getting file' });
    }
};
exports.getFileById = getFileById;
