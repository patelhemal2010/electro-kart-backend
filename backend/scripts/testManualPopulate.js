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

const testManualPopulate = async () => {
  await connectDB();

  console.log('\n=== Testing Manual Populate ===\n');

  // Get a product
  const product = await Product.findOne({ name: 'Logitech MX Master 3S' });
  console.log(`Product: ${product.name}`);
  console.log(`Product category ID: ${product.category}`);

  // Get the category
  const category = await Category.findOne({ name: 'Accessories' });
  console.log(`Category: ${category.name}`);
  console.log(`Category ID: ${category._id}`);

  // Try to manually populate
  const populatedProduct = await Product.findById(product._id).populate('category');
  console.log(`\nPopulated product category: ${populatedProduct.category}`);

  // Try a different approach - find products by category ID
  const productsByCategory = await Product.find({ category: category._id }).populate('category');
  console.log(`\nProducts found by category ID: ${productsByCategory.length}`);
  productsByCategory.forEach(p => {
    console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
  });

  // Try to create a new product with proper category
  console.log('\n=== Testing New Product Creation ===\n');
  const newProduct = new Product({
    name: 'Test Accessory',
    brand: 'Test Brand',
    price: 100,
    description: 'Test description',
    category: category._id,
    image: 'test.jpg',
    quantity: 1
  });

  try {
    await newProduct.save();
    console.log('New product created successfully');
    
    const savedProduct = await Product.findById(newProduct._id).populate('category');
    console.log(`Saved product category: ${savedProduct.category ? savedProduct.category.name : 'N/A'}`);
    
    // Clean up
    await Product.findByIdAndDelete(newProduct._id);
    console.log('Test product deleted');
  } catch (error) {
    console.error('Error creating test product:', error.message);
  }

  mongoose.disconnect();
};

testManualPopulate();
