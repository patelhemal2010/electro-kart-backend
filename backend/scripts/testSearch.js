import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import dotenv from 'dotenv';

dotenv.config();

const testSearch = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electrokart');
    console.log('Connected to MongoDB');

    // Test search for "Mobiles" (should return smartphone products)
    console.log('\n=== Testing search for "Mobiles" ===');
    const mobileCategory = await Category.findOne({ name: 'Mobiles' });
    if (mobileCategory) {
      const mobileProducts = await Product.find({ category: mobileCategory._id }).populate('category');
      console.log(`Found ${mobileProducts.length} mobile products:`);
      mobileProducts.forEach(product => console.log(`- ${product.name}`));
    }

    // Test search for "Laptops" (should return laptop products)
    console.log('\n=== Testing search for "Laptops" ===');
    const laptopCategory = await Category.findOne({ name: 'Laptops' });
    if (laptopCategory) {
      const laptopProducts = await Product.find({ category: laptopCategory._id }).populate('category');
      console.log(`Found ${laptopProducts.length} laptop products:`);
      laptopProducts.forEach(product => console.log(`- ${product.name}`));
    }

    // Test search for "Electronics" with headphone filter
    console.log('\n=== Testing search for "Electronics" with headphone filter ===');
    const electronicsCategory = await Category.findOne({ name: 'Electronics' });
    if (electronicsCategory) {
      const headphoneProducts = await Product.find({
        category: electronicsCategory._id,
        $or: [
          { name: { $regex: 'headphone', $options: "i" } },
          { name: { $regex: 'earphone', $options: "i" } },
          { name: { $regex: 'airpod', $options: "i" } },
          { name: { $regex: 'headset', $options: "i" } },
          { name: { $regex: 'audio', $options: "i" } }
        ]
      }).populate('category');
      console.log(`Found ${headphoneProducts.length} headphone products:`);
      headphoneProducts.forEach(product => console.log(`- ${product.name}`));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing search:', error);
    process.exit(1);
  }
};

testSearch();
