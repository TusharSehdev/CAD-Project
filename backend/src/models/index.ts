import { Block, File, Category } from '../types';

// Mock data for categories
export const categories: Category[] = [
  { id: 1, name: 'Mechanical', description: 'Mechanical parts and components' },
  { id: 2, name: 'Electrical', description: 'Electrical components and modules' },
  { id: 3, name: 'Hydraulic', description: 'Hydraulic components and systems' },
  { id: 4, name: 'Structural', description: 'Structural elements and frameworks' },
];

// Mock data for files (empty at first, will be populated when files are uploaded)
export const files: File[] = [];

// Mock data for blocks (empty at first, will be populated when files are uploaded)
export const blocks: Block[] = [];

// Helper function to get the next ID
export const getNextId = (items: any[]): number => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}; 