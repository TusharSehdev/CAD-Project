import { Router } from 'express';
import { getBlocks, getBlockById } from '../controllers/block.controller';

const router = Router();

// Get all blocks
router.get('/blocks', getBlocks);

// Get a block by ID
router.get('/blocks/:id', getBlockById);

export { router as blockRouter }; 