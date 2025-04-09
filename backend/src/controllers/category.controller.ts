import { Request, Response } from 'express';
import { Category } from '../models/db.models';

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Error getting categories' });
  }
}; 