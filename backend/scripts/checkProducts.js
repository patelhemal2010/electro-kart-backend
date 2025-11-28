import mongoose from 'mongoose';
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

const checkProducts = async () => {
  await connectDB();

  const products = await Product.find({ 
    name: { $in: ['Logitech MX Master 3S', 'Razer DeathAdder V3 Pro', 'Logitech G915 TKL'] } 
  });

  console.log('Product details:');
  products.forEach(p => {
    console.log(`  - ${p.name}`);
    console.log(`    Category ID: ${p.category}`);
    console.log(`    Category Type: ${typeof p.category}`);
    console.log('');
  });

  mongoose.disconnect();
};

checkProducts();