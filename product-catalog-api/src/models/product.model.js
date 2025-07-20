import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  size: String,
  color: String,
  stock: { type: Number, default: 0, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, max: 100 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  variants: [variantSchema],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// For text search
productSchema.index({ name: 'text', description: 'text' });

// Virtual for final price
productSchema.virtual('finalPrice').get(function() {
  return this.price * (1 - this.discount / 100);
});

export default mongoose.model('Product', productSchema);