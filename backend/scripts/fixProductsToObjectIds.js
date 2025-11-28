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

const fixProductsToObjectIds = async () => {
  await connectDB();

  console.log('\n=== Fixing Products to Use ObjectIds ===\n');

  const db = mongoose.connection.db;

  // Get the Accessories category
  const accessoriesCategory = await db.collection('categories').findOne({ name: 'Accessories' });
  console.log(`Accessories category: ${accessoriesCategory.name} (ID: ${accessoriesCategory._id})`);

  // Convert the string ID to ObjectId
  const accessoriesObjectId = new mongoose.Types.ObjectId(accessoriesCategory._id);
  console.log(`Accessories ObjectId: ${accessoriesObjectId}`);

  // Update products to use ObjectId
  const accessoryProductNames = ['Logitech MX Master 3S', 'Razer DeathAdder V3 Pro', 'Logitech G915 TKL'];
  
  for (const productName of accessoryProductNames) {
    console.log(`\nUpdating product: ${productName}`);
    
    const result = await db.collection('products').updateOne(
      { name: productName },
      { $set: { category: accessoriesObjectId } }
    );
    
    console.log(`Update result: ${result.modifiedCount} documents modified`);
  }

  // Test the search
  console.log('\n=== Testing Search After Fix ===\n');
  const products = await Product.find({
    category: accessoriesObjectId
  }).populate('category');

  console.log(`Found ${products.length} accessories products:`);
  products.forEach(p => {
    console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
  });

  mongoose.disconnect();
};

fixProductsToObjectIds();
