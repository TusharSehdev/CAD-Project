"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRouter = void 0;
const express_1 = require("express");
const file_controller_1 = require("../controllers/file.controller");
const upload_1 = require("../utils/upload");
const router = (0, express_1.Router)();
exports.fileRouter = router;
// Upload a file
router.post('/upload', upload_1.upload.single('file'), file_controller_1.uploadFile);
// Get all files
router.get('/files', file_controller_1.getFiles);
// Get a file by ID
router.get('/files/:id', file_controller_1.getFileById);
