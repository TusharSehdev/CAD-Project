import { Category } from '../models/db.models';

export const seedCategories = async (): Promise<void> => {
  try {
    const categoryCount = await Category.count();
    
    if (categoryCount === 0) {
      const categories = [
        { name: 'Mechanical', description: 'Mechanical parts and components' },
        { name: 'Electrical', description: 'Electrical components and modules' },
        { name: 'Hydraulic', description: 'Hydraulic components and systems' },
        { name: 'Structural', description: 'Structural elements and frameworks' }
      ];
      
      await Category.bulkCreate(categories);
      console.log('Categories seeded successfully');
    } else {
      console.log('Categories already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}; 