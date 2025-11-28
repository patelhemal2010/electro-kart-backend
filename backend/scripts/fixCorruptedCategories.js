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

const fixCorruptedCategories = async () => {
  await connectDB();

  console.log('\n=== Fixing Corrupted Category References ===\n');

  // Get the Accessories category
  const accessoriesCategory = await Category.findOne({ name: 'Accessories' });
  console.log(`Accessories category: ${accessoriesCategory.name} (ID: ${accessoriesCategory._id})`);

  // Get products that should be accessories
  const accessoryProductNames = ['Logitech MX Master 3S', 'Razer DeathAdder V3 Pro', 'Logitech G915 TKL'];
  
  for (const productName of accessoryProductNames) {
    const product = await Product.findOne({ name: productName });
    if (product) {
      console.log(`\nFixing product: ${product.name}`);
      console.log(`Current category ID: ${product.category}`);
      
      // Create a fresh ObjectId for the category
      const freshCategoryId = new mongoose.Types.ObjectId(accessoriesCategory._id.toString());
      console.log(`Fresh category ID: ${freshCategoryId}`);
      
      // Update the product with the fresh ObjectId
      const result = await Product.updateOne(
        { _id: product._id },
        { $set: { category: freshCategoryId } }
      );
      
      console.log(`Update result: ${result.modifiedCount} documents modified`);
      
      // Test the populate
      const updatedProduct = await Product.findById(product._id).populate('category');
      console.log(`Populated category: ${updatedProduct.category ? updatedProduct.category.name : 'N/A'}`);
    }
  }

  // Test the search API
  console.log('\n=== Testing Search After Fix ===\n');
  const products = await Product.find({
    category: accessoriesCategory._id
  }).populate('category');

  console.log(`Found ${products.length} accessories products:`);
  products.forEach(p => {
    console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
  });

  mongoose.disconnect();
};

fixCorruptedCategories();
