import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import dotenv from 'dotenv';

dotenv.config();

const debugProductMatching = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electrokart');
    console.log('Connected to MongoDB');

    // Get Electronics category
    const electronicsCategory = await Category.findOne({ name: 'Electronics' });
    const electronicsProducts = await Product.find({ category: electronicsCategory._id });
    
    console.log('\n=== Electronics Products Details ===');
    electronicsProducts.forEach(product => {
      console.log(`\nProduct: ${product.name}`);
      console.log(`Brand: ${product.brand}`);
      console.log(`Description: ${product.description}`);
    });

    // Test specific filters
    console.log('\n=== Testing Camera Filters ===');
    const cameraFilters = ['camera', 'dslr', 'mirrorless', 'photography', 'lens', 'zoom', 'digital camera', 'photo'];
    
    electronicsProducts.forEach(product => {
      console.log(`\nTesting: ${product.name}`);
      cameraFilters.forEach(filter => {
        const nameMatch = product.name.toLowerCase().includes(filter.toLowerCase());
        const descMatch = product.description.toLowerCase().includes(filter.toLowerCase());
        if (nameMatch || descMatch) {
          console.log(`  ✓ Matches "${filter}": name=${nameMatch}, desc=${descMatch}`);
        }
      });
    });

    console.log('\n=== Testing Headphone Filters ===');
    const headphoneFilters = ['headphone', 'earphone', 'earbud', 'airpod', 'headset', 'wh-1000xm', 'wireless headphone', 'noise cancelling'];
    
    electronicsProducts.forEach(product => {
      console.log(`\nTesting: ${product.name}`);
      headphoneFilters.forEach(filter => {
        const nameMatch = product.name.toLowerCase().includes(filter.toLowerCase());
        const descMatch = product.description.toLowerCase().includes(filter.toLowerCase());
        if (nameMatch || descMatch) {
          console.log(`  ✓ Matches "${filter}": name=${nameMatch}, desc=${descMatch}`);
        }
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error debugging product matching:', error);
    process.exit(1);
  }
};

debugProductMatching();
