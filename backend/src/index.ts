import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { fileRouter } from './routes/file.routes';
import { blockRouter } from './routes/block.routes';
import { categoryRouter } from './routes/category.routes';
import { initializeDatabase } from './config/db';
import { seedCategories } from './config/seedData';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', fileRouter);
app.use('/api', blockRouter);
app.use('/api', categoryRouter);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('CAD Blocks API is running!');
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Seed initial data
    await seedCategories();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 