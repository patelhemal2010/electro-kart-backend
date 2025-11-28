import mongoose from 'mongoose';
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

const checkAccessoriesProducts = async () => {
  await connectDB();

  console.log('\n=== Checking Accessories Products ===\n');

  const db = mongoose.connection.db;
  
  const accessoryProductNames = ['Logitech MX Master 3S', 'Razer DeathAdder V3 Pro', 'Logitech G915 TKL'];
  
  for (const productName of accessoryProductNames) {
    const product = await db.collection('products').findOne({ name: productName });
    if (product) {
      console.log(`${productName}:`);
      console.log(`  Category: ${product.category}`);
      console.log(`  Category Type: ${typeof product.category}`);
      console.log('');
    } else {
      console.log(`${productName}: Not found`);
    }
  }

  mongoose.disconnect();
};

checkAccessoriesProducts();
