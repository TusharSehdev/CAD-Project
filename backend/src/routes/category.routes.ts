import { Router } from 'express';
import { getCategories } from '../controllers/category.controller';

const router = Router();

// Get all categories
router.get('/categories', getCategories);

export { router as categoryRouter }; 