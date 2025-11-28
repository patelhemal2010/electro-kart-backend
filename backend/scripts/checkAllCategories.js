import mongoose from 'mongoose';
import Category from '../models/categoryModel.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const checkAllCategories = async () => {
  await connectDB();

  console.log('\n=== All Categories in Database ===\n');

  const categories = await Category.find({});
  console.log(`Total categories: ${categories.length}`);
  
  categories.forEach((cat, index) => {
    console.log(`${index + 1}. ${cat.name} (ID: ${cat._id})`);
  });

  // Check specifically for Accessories
  const accessoriesCategory = await Category.findOne({ name: 'Accessories' });
  console.log(`\nAccessories category: ${accessoriesCategory ? accessoriesCategory.name : 'Not found'}`);
  console.log(`Accessories ID: ${accessoriesCategory ? accessoriesCategory._id : 'N/A'}`);

  mongoose.disconnect();
};

checkAllCategories();
