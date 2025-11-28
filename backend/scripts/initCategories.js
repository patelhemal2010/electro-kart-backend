import mongoose from 'mongoose';
import Category from '../models/categoryModel.js';
import dotenv from 'dotenv';

dotenv.config();

const initCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electrokart');
    console.log('Connected to MongoDB');

    // Define the categories we want to create
    const categories = [
      'Smartphones',
      'Laptops', 
      'Headphones',
      'Cameras',
      'Gaming',
      'Accessories'
    ];

    // Check existing categories
    const existingCategories = await Category.find({});
    console.log('Existing categories:', existingCategories.map(cat => cat.name));

    // Create missing categories
    for (const categoryName of categories) {
      const existingCategory = await Category.findOne({ name: categoryName });
      
      if (!existingCategory) {
        const newCategory = new Category({ name: categoryName });
        await newCategory.save();
        console.log(`Created category: ${categoryName}`);
      } else {
        console.log(`Category already exists: ${categoryName}`);
      }
    }

    // List all categories after initialization
    const allCategories = await Category.find({});
    console.log('All categories in database:', allCategories.map(cat => cat.name));

    process.exit(0);
  } catch (error) {
    console.error('Error initializing categories:', error);
    process.exit(1);
  }
};

initCategories();
