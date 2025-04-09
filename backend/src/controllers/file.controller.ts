import { Request, Response } from 'express';
import { File, Block, Category } from '../models/db.models';
import { parseCadFile } from '../utils/upload';
import { Op } from 'sequelize';

// Upload a file and parse CAD blocks
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Add file to database
    const newFile = await File.create({
      name: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      type: req.file.mimetype,
      uploadedAt: new Date()
    });
    
    // Parse the CAD file (mock)
    const parsedBlocks = parseCadFile(req.file.path);
    
    // Add blocks to database
    const newBlocks = await Promise.all(parsedBlocks.map(async (block) => {
      // Find the category by name or create a default
      let categoryId = parseInt(block.category);
      
      // If the block.category is not a valid number, use the Mechanical category (id: 1)
      if (isNaN(categoryId)) {
        const category = await Category.findOne({ where: { name: 'Mechanical' } });
        categoryId = category ? category.id : 1;
      }
      
      return Block.create({
        name: block.name,
        categoryId: categoryId,
        fileId: newFile.id,
        properties: block.properties
      });
    }));
    
    res.status(200).json({ 
      message: 'File uploaded successfully',
      filename: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      blocks: newBlocks
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
};

// Get all files with pagination
export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await File.findAndCountAll({
      limit,
      offset,
      order: [['uploadedAt', 'DESC']]
    });
    
    res.status(200).json({
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      files: rows
    });
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ error: 'Error getting files' });
  }
};

// Get a file by ID
export const getFileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    const file = await File.findByPk(id, {
      include: [
        {
          model: Block,
          include: [Category]
        }
      ]
    });
    
    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    
    res.status(200).json(file);
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ error: 'Error getting file' });
  }
}; 