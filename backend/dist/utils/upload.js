"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.parseCadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
// Make sure the upload directory exists
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
// Mock CAD file parser
const parseCadFile = (filePath) => {
    // In a real application, this would parse the CAD file
    // For demo purposes, we'll return mock data
    // Generate a random number of blocks (between 2 and 10)
    const numBlocks = Math.floor(Math.random() * 8) + 2;
    const blocks = [];
    for (let i = 0; i < numBlocks; i++) {
        const blockTypes = ['Gear', 'Shaft', 'Bearing', 'Motor', 'Sensor', 'Pump', 'Valve'];
        const categoryIds = [1, 2, 3, 4]; // Matches the category IDs in our model
        blocks.push({
            name: `${blockTypes[Math.floor(Math.random() * blockTypes.length)]}_${i}`,
            category: categoryIds[Math.floor(Math.random() * categoryIds.length)].toString(),
            properties: {
                length: Math.round(Math.random() * 100),
                width: Math.round(Math.random() * 100),
                height: Math.round(Math.random() * 100),
                material: ['Steel', 'Aluminum', 'Plastic', 'Copper'][Math.floor(Math.random() * 4)]
            }
        });
    }
    return blocks;
};
exports.parseCadFile = parseCadFile;
// Export multer middleware
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only certain file types (for demo, we'll accept all)
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB limit
    }
});
