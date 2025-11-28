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

const testPopulateWithStringRefs = async () => {
  await connectDB();

  console.log('\n=== Testing Populate with String References ===\n');

  // Test populate with string references
  const products = await Product.find({
    category: '68a711f8fe36d79180f20619'
  }).populate('category');

  console.log(`Found ${products.length} accessories products:`);
  products.forEach(p => {
    console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
  });

  // Test the search API
  console.log('\n=== Testing Search API ===\n');
  const response = await fetch('http://localhost:5000/api/products/search?keyword=Accessories');
  const data = await response.json();
  
  console.log(`API returned ${data.products.length} products:`);
  data.products.forEach(p => {
    console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
  });

  mongoose.disconnect();
};

testPopulateWithStringRefs();
