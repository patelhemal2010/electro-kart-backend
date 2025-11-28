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

const recreateCategoriesWithObjectIds = async () => {
  await connectDB();

  console.log('\n=== Recreating Categories with ObjectIds ===\n');

  const db = mongoose.connection.db;

  // Get all categories
  const categories = await db.collection('categories').find({}).toArray();
  console.log(`Found ${categories.length} categories`);

  // Create a mapping from old string IDs to new ObjectIds
  const categoryMapping = {};
  
  // Delete all existing categories
  await db.collection('categories').deleteMany({});
  console.log('Deleted all existing categories');

  // Create new categories with proper ObjectIds
  for (const category of categories) {
    const newId = new mongoose.Types.ObjectId();
    categoryMapping[category._id] = newId;
    
    console.log(`Creating ${category.name}: ${category._id} -> ${newId}`);
    
    // Create new category with ObjectId
    await db.collection('categories').insertOne({
      _id: newId,
      name: category.name
    });
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

recreateCategoriesWithObjectIds();
