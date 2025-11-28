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

const testRawMongoDB = async () => {
  await connectDB();

  console.log('\n=== Testing Raw MongoDB Queries ===\n');

  const categoryId = '68a711f8fe36d79180f20619';

  // Use the raw MongoDB connection
  const db = mongoose.connection.db;
  
  console.log('1. Raw MongoDB find by ObjectId:');
  const category1 = await db.collection('categories').findOne({ _id: new mongoose.Types.ObjectId(categoryId) });
  console.log(`Result: ${category1 ? category1.name : 'Not found'}`);

  console.log('\n2. Raw MongoDB find by string:');
  const category2 = await db.collection('categories').findOne({ _id: categoryId });
  console.log(`Result: ${category2 ? category2.name : 'Not found'}`);

  console.log('\n3. Raw MongoDB find all categories:');
  const allCategories = await db.collection('categories').find({}).toArray();
  console.log(`Found ${allCategories.length} categories:`);
  allCategories.forEach(cat => {
    console.log(`  ${cat.name}: ${cat._id}`);
  });

  console.log('\n4. Raw MongoDB find products with category:');
  const products = await db.collection('products').find({ category: new mongoose.Types.ObjectId(categoryId) }).toArray();
  console.log(`Found ${products.length} products with category ${categoryId}`);

  mongoose.disconnect();
};

testRawMongoDB();
