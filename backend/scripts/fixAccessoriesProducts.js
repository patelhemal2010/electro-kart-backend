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

const fixAccessoriesProducts = async () => {
  await connectDB();

  console.log('\n=== Fixing Accessories Products ===\n');

  // Get Accessories category
  const accessoriesCategory = await Category.findOne({ name: 'Accessories' });
  console.log(`Accessories category: ${accessoriesCategory ? accessoriesCategory.name : 'Not found'}`);
  console.log(`Accessories category ID: ${accessoriesCategory ? accessoriesCategory._id : 'N/A'}`);

  if (accessoriesCategory) {
    // Find products that should be accessories
    const accessoryProductNames = ['Logitech MX Master 3S', 'Razer DeathAdder V3 Pro', 'Logitech G915 TKL'];
    
    for (const productName of accessoryProductNames) {
      const product = await Product.findOne({ name: productName });
      if (product) {
        console.log(`\nFound product: ${product.name}`);
        console.log(`Current category: ${product.category}`);
        
        // Update the category
        const result = await Product.updateOne(
          { _id: product._id },
          { $set: { category: accessoriesCategory._id } }
        );
        
        console.log(`Update result: ${result.modifiedCount} documents modified`);
        
        // Verify the update
        const updatedProduct = await Product.findById(product._id);
        console.log(`Updated category: ${updatedProduct.category}`);
      } else {
        console.log(`Product not found: ${productName}`);
      }
    }
  }

  // Test the search
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

fixAccessoriesProducts();
