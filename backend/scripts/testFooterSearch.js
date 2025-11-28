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

const testFooterSearch = async () => {
  await connectDB();

  const categoryMapping = {
    'Accessories': {
      categories: ['Accessories', 'accessories', 'Accessory', 'accessory'],
      productFilters: ['accessory', 'gadget', 'peripheral', 'mouse', 'keyboard', 'monitor', 'speaker', 'charger']
    }
  };

  const keyword = 'Accessories';
  const mapping = categoryMapping[keyword];

  console.log(`\n=== Testing Footer Search: "${keyword}" ===\n`);

  if (mapping) {
    const matchingCategories = await Category.find({
      name: { $in: mapping.categories }
    });

    console.log('Matching categories:', matchingCategories.map(c => c.name));

    if (matchingCategories.length > 0) {
      const categoryIds = matchingCategories.map(cat => cat._id);
      
      // First, let's see all products in the Accessories category
      const allAccessoriesProducts = await Product.find({
        category: { $in: categoryIds }
      }).populate('category');

      console.log(`Found ${allAccessoriesProducts.length} accessories products:`);
      allAccessoriesProducts.forEach(p => {
        console.log(`  - ${p.name}`);
        console.log(`    Category ID: ${p.category}`);
        console.log(`    Category Name: ${p.category ? p.category.name : 'N/A'}`);
        console.log('');
      });
      
      // Also check products that might match the product filters
      console.log('\n--- Testing Product Filters ---');
      const productFilters = mapping.productFilters.map(filter => ({
        $or: [
          { name: { $regex: filter, $options: "i" } },
          { description: { $regex: filter, $options: "i" } }
        ]
      }));
      
      const filteredProducts = await Product.find({
        $or: productFilters
      }).populate('category');
      
      console.log(`Found ${filteredProducts.length} products matching filters:`);
      filteredProducts.forEach(p => {
        console.log(`  - ${p.name} (Category: ${p.category ? p.category.name : 'N/A'})`);
      });
    } else {
      console.log('No matching categories found');
    }
  }

  mongoose.disconnect();
};

testFooterSearch();
