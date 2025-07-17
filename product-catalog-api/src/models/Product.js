import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  size: String,
  color: String,
  stock: { type: Number, default: 0, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, max: 100 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  variants: [variantSchema],
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ name: 'text', description: 'text' }); // For search

export default mongoose.model('Product', productSchema);