import { Request, Response } from 'express';
import { Block, Category } from '../models/db.models';
import { Op } from 'sequelize';

// Get all blocks with pagination and filtering
export const getBlocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const fileId = req.query.fileId ? parseInt(req.query.fileId as string) : undefined;
    
    // Build the where clause based on filters
    const whereClause: any = {};
    
    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`
      };
    }
    
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    if (fileId) {
      whereClause.fileId = fileId;
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Block.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [Category],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      blocks: rows
    });
  } catch (error) {
    console.error('Error getting blocks:', error);
    res.status(500).json({ error: 'Error getting blocks' });
  }
};

// Get a block by ID
export const getBlockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    const block = await Block.findByPk(id, {
      include: [Category]
    });
    
    if (!block) {
      res.status(404).json({ error: 'Block not found' });
      return;
    }
    
    res.status(200).json(block);
  } catch (error) {
    console.error('Error getting block:', error);
    res.status(500).json({ error: 'Error getting block' });
  }
}; 