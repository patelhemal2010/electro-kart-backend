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

const fixCategoryIdMismatch = async () => {
  await connectDB();

  console.log('\n=== Fixing Category ID Mismatch ===\n');

  const db = mongoose.connection.db;

  // Get all categories with their string IDs
  const categories = await db.collection('categories').find({}).toArray();
  console.log('Categories with string IDs:');
  categories.forEach(cat => {
    console.log(`  ${cat.name}: ${cat._id}`);
  });

  // Get the Accessories category string ID
  const accessoriesCategory = categories.find(cat => cat.name === 'Accessories');
  console.log(`\nAccessories category string ID: ${accessoriesCategory._id}`);

  // Update products to use string category IDs
  const accessoryProductNames = ['Logitech MX Master 3S', 'Razer DeathAdder V3 Pro', 'Logitech G915 TKL'];
  
  for (const productName of accessoryProductNames) {
    console.log(`\nUpdating product: ${productName}`);
    
    // Update using raw MongoDB to set string ID
    const result = await db.collection('products').updateOne(
      { name: productName },
      { $set: { category: accessoriesCategory._id } }
    );
    
    console.log(`Update result: ${result.modifiedCount} documents modified`);
  }

  // Test the populate after fix
  console.log('\n=== Testing Populate After Fix ===\n');
  const products = await Product.find({
    category: accessoriesCategory._id
  }).populate('category');

  console.log(`Found ${products.length} accessories products:`);
  products.forEach(p => {
    console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
  });

  mongoose.disconnect();
};

fixCategoryIdMismatch();
