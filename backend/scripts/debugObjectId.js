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

const debugObjectId = async () => {
  await connectDB();

  console.log('\n=== Debugging ObjectId Issue ===\n');

  // Get the product
  const product = await Product.findOne({ name: 'Logitech MX Master 3S' });
  console.log(`Product category ID: ${product.category}`);
  console.log(`Product category ID type: ${typeof product.category}`);
  console.log(`Product category ID string: ${product.category.toString()}`);

  // Get the category
  const category = await Category.findOne({ name: 'Accessories' });
  console.log(`\nCategory ID: ${category._id}`);
  console.log(`Category ID type: ${typeof category._id}`);
  console.log(`Category ID string: ${category._id.toString()}`);

  // Compare the IDs
  console.log(`\nIDs match: ${product.category.toString() === category._id.toString()}`);

  // Try to find the category by the exact ID from the product
  const foundCategory = await Category.findById(product.category);
  console.log(`\nFound category by product's category ID: ${foundCategory ? foundCategory.name : 'Not found'}`);

  // Try to find the product by the exact category ID
  const productsWithCategory = await Product.find({ category: category._id });
  console.log(`\nProducts with this category ID: ${productsWithCategory.length}`);
  productsWithCategory.forEach(p => console.log(`  - ${p.name}`));

  mongoose.disconnect();
};

debugObjectId();
