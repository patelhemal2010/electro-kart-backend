import mongoose from 'mongoose';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
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

const fixCategoriesToObjectIds = async () => {
  await connectDB();

  console.log('\n=== Fixing Categories to Use ObjectIds ===\n');

  const db = mongoose.connection.db;

  // Get all categories
  const categories = await db.collection('categories').find({}).toArray();
  console.log(`Found ${categories.length} categories`);

  // Create a mapping from old string IDs to new ObjectIds
  const categoryMapping = {};
  
  for (const category of categories) {
    const oldId = category._id;
    const newId = new mongoose.Types.ObjectId();
    categoryMapping[oldId] = newId;
    
    console.log(`Mapping ${category.name}: ${oldId} -> ${newId}`);
    
    // Update the category with new ObjectId
    await db.collection('categories').updateOne(
      { _id: oldId },
      { $set: { _id: newId } }
    );
  }

  // Update all products to use the new ObjectIds
  console.log('\n=== Updating Products ===\n');
  const products = await db.collection('products').find({}).toArray();
  
  for (const product of products) {
    const oldCategoryId = product.category;
    const newCategoryId = categoryMapping[oldCategoryId];
    
    if (newCategoryId) {
      console.log(`Updating ${product.name}: ${oldCategoryId} -> ${newCategoryId}`);
      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: { category: newCategoryId } }
      );
    }
  }

  console.log('\n=== Testing After Fix ===\n');
  
  // Test populate
  const accessoriesObjectId = categoryMapping['68a711f8fe36d79180f20619'];
  const testProducts = await Product.find({
    category: accessoriesObjectId
  }).populate('category');

  console.log(`Found ${testProducts.length} accessories products:`);
  testProducts.forEach(p => {
    console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
  });

  mongoose.disconnect();
};

fixCategoriesToObjectIds();