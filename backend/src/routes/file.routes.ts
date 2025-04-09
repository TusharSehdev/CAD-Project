import { Router } from 'express';
import { uploadFile, getFiles, getFileById } from '../controllers/file.controller';
import { upload } from '../utils/upload';

const router = Router();

// Upload a file
router.post('/upload', upload.single('file'), uploadFile);

// Get all files
router.get('/files', getFiles);

// Get a file by ID
router.get('/files/:id', getFileById);

export { router as fileRouter }; 