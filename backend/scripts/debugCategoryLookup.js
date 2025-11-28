import mongoose from 'mongoose';
import Product from '../models/productModel.js';
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

const debugCategoryLookup = async () => {
  await connectDB();

  console.log('\n=== Debugging Category Lookup ===\n');

  const categoryId = '68a711f8fe36d79180f20619';
  console.log(`Looking for category with ID: ${categoryId}`);

  // Try different ways to find the category
  console.log('\n1. Find by string ID:');
  const category1 = await Category.findById(categoryId);
  console.log(`Result: ${category1 ? category1.name : 'Not found'}`);

  console.log('\n2. Find by ObjectId:');
  const category2 = await Category.findById(new mongoose.Types.ObjectId(categoryId));
  console.log(`Result: ${category2 ? category2.name : 'Not found'}`);

  console.log('\n3. Find by _id field:');
  const category3 = await Category.findOne({ _id: categoryId });
  console.log(`Result: ${category3 ? category3.name : 'Not found'}`);

  console.log('\n4. Find by _id field with ObjectId:');
  const category4 = await Category.findOne({ _id: new mongoose.Types.ObjectId(categoryId) });
  console.log(`Result: ${category4 ? category4.name : 'Not found'}`);

  console.log('\n5. Find all categories and check IDs:');
  const allCategories = await Category.find({});
  allCategories.forEach(cat => {
    console.log(`  ${cat.name}: ${cat._id} (matches: ${cat._id.toString() === categoryId})`);
  });

  // Try to find products with this category ID
  console.log('\n6. Find products with this category ID:');
  const products = await Product.find({ category: categoryId });
  console.log(`Found ${products.length} products with category ID ${categoryId}`);

  mongoose.disconnect();
};

debugCategoryLookup();
