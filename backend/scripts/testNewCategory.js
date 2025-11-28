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

const testNewCategory = async () => {
  await connectDB();

  console.log('\n=== Testing with New Category ===\n');

  // Create a new category
  const newCategory = new Category({ name: 'TestCategory' });
  await newCategory.save();
  console.log(`Created new category: ${newCategory.name} (ID: ${newCategory._id})`);

  // Create a new product with this category
  const newProduct = new Product({
    name: 'Test Product',
    brand: 'Test Brand',
    price: 100,
    description: 'Test description',
    category: newCategory._id,
    image: 'test.jpg',
    quantity: 1
  });

  await newProduct.save();
  console.log(`Created new product: ${newProduct.name} (Category ID: ${newProduct.category})`);

  // Try to populate
  const populatedProduct = await Product.findById(newProduct._id).populate('category');
  console.log(`Populated product category: ${populatedProduct.category ? populatedProduct.category.name : 'N/A'}`);

  // Try to find the category directly
  const foundCategory = await Category.findById(newProduct.category);
  console.log(`Found category by ID: ${foundCategory ? foundCategory.name : 'N/A'}`);

  // Clean up
  await Product.findByIdAndDelete(newProduct._id);
  await Category.findByIdAndDelete(newCategory._id);
  console.log('Test data cleaned up');

  mongoose.disconnect();
};

testNewCategory();
