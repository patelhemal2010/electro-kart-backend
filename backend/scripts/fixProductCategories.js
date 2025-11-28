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

const fixProductCategories = async () => {
  await connectDB();

  console.log('\n=== Fixing Product Categories ===\n');

  // Get all categories
  const categories = await Category.find({});
  console.log('All categories in database:');
  categories.forEach(cat => console.log(`  - ${cat.name} (ID: ${cat._id})`));

  // Find Accessories category
  const accessoriesCategory = await Category.findOne({ name: 'Accessories' });
  if (accessoriesCategory) {
    console.log(`\nAccessories category ID: ${accessoriesCategory._id}`);
    
    // Update products that should be in Accessories category
    const accessoryProducts = ['Logitech MX Master 3S', 'Razer DeathAdder V3 Pro', 'Logitech G915 TKL'];
    
    for (const productName of accessoryProducts) {
      const result = await Product.updateOne(
        { name: productName },
        { category: accessoriesCategory._id }
      );
      console.log(`Updated ${productName}: ${result.modifiedCount} documents modified`);
    }
  }

  // Test the search again
  console.log('\n=== Testing Search After Fix ===\n');
  const categoryMapping = {
    'Accessories': {
      categories: ['Accessories', 'accessories', 'Accessory', 'accessory'],
      productFilters: ['accessory', 'gadget', 'peripheral', 'mouse', 'keyboard', 'monitor', 'speaker', 'charger']
    }
  };

  const keyword = 'Accessories';
  const mapping = categoryMapping[keyword];

  if (mapping) {
    const matchingCategories = await Category.find({
      name: { $in: mapping.categories }
    });

    if (matchingCategories.length > 0) {
      const categoryIds = matchingCategories.map(cat => cat._id);
      const products = await Product.find({
        category: { $in: categoryIds }
      }).populate('category');

      console.log(`Found ${products.length} accessories products:`);
      products.forEach(p => {
        console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
      });
    }
  }

  mongoose.disconnect();
};

fixProductCategories();
