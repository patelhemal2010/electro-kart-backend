import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import dotenv from 'dotenv';

dotenv.config();

const testAllCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electrokart');
    console.log('Connected to MongoDB');

    // Get all categories
    const categories = await Category.find({});
    console.log('Available categories:', categories.map(cat => cat.name));

    // Test each category individually
    for (const category of categories) {
      console.log(`\n=== Testing Category: ${category.name} ===`);
      
      const products = await Product.find({ category: category._id }).populate('category');
      console.log(`Found ${products.length} products in ${category.name}:`);
      
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} (Brand: ${product.brand})`);
      });
    }

    // Test the specific frontend category mappings
    console.log('\n=== Testing Frontend Category Mappings ===');
    
    const categoryMappings = {
      'Smartphones': 'Mobiles',
      'Laptops': 'Laptops', 
      'Headphones': 'Electronics',
      'Cameras': 'Electronics',
      'Gaming': 'Electronics',
      'Accessories': 'Accessories'
    };

    for (const [frontendName, dbCategoryName] of Object.entries(categoryMappings)) {
      console.log(`\n--- Frontend: ${frontendName} -> Database: ${dbCategoryName} ---`);
      
      const category = await Category.findOne({ name: dbCategoryName });
      if (category) {
        let products = [];
        
        if (dbCategoryName === 'Electronics') {
          // For Electronics, we need to filter by product type
          const productFilters = {
            'Headphones': ['headphone', 'earphone', 'earbud', 'airpod', 'headset', 'wh-1000xm', 'wireless headphone', 'noise cancelling'],
            'Cameras': ['camera', 'dslr', 'mirrorless', 'photography', 'lens', 'zoom', 'digital camera', 'photo'],
            'Gaming': ['gaming', 'game', 'console', 'playstation', 'xbox', 'nintendo', 'controller', 'gaming laptop']
          };
          
          const filters = productFilters[frontendName] || [];
          if (filters.length > 0) {
            const regexPatterns = filters.map(filter => ({
              $or: [
                { name: { $regex: filter, $options: "i" } },
                { description: { $regex: filter, $options: "i" } }
              ]
            }));
            
            products = await Product.find({
              category: category._id,
              $or: regexPatterns
            }).populate('category');
          }
        } else {
          // For specific categories
          products = await Product.find({ category: category._id }).populate('category');
        }
        
        console.log(`Found ${products.length} products for ${frontendName}:`);
        products.forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.name} (Brand: ${product.brand})`);
        });
      } else {
        console.log(`Category ${dbCategoryName} not found in database`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing categories:', error);
    process.exit(1);
  }
};

testAllCategories();
