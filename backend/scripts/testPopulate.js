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

const testPopulate = async () => {
  await connectDB();

  console.log('\n=== Testing Populate ===\n');

  // Test 1: Get a single product and populate
  const product = await Product.findOne({ name: 'Logitech MX Master 3S' });
  console.log('Product without populate:');
  console.log(`  Name: ${product.name}`);
  console.log(`  Category ID: ${product.category}`);
  console.log(`  Category Type: ${typeof product.category}`);

  // Test 2: Populate the category
  const populatedProduct = await Product.findOne({ name: 'Logitech MX Master 3S' }).populate('category');
  console.log('\nProduct with populate:');
  console.log(`  Name: ${populatedProduct.name}`);
  console.log(`  Category: ${populatedProduct.category}`);
  console.log(`  Category Type: ${typeof populatedProduct.category}`);
  
  if (populatedProduct.category) {
    console.log(`  Category Name: ${populatedProduct.category.name}`);
  }

  // Test 3: Check if category exists
  const category = await Category.findById(product.category);
  console.log('\nCategory lookup:');
  console.log(`  Category ID: ${category ? category._id : 'Not found'}`);
  console.log(`  Category Name: ${category ? category.name : 'Not found'}`);

  mongoose.disconnect();
};

testPopulate();
