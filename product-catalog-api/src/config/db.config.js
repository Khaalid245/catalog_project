import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Loads environment variables from .env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB connection failed: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;
