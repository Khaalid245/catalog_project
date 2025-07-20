import Product from '../models/product.model.js';
import AppError from '../utils/appError.js';

// Create a product
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// Get all products with filtering
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, inStock } = req.query;
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (inStock === 'true') {
      filter['variants.stock'] = { $gt: 0 };
    }

    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Get single product by ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return next(new AppError('Product not found', 404));
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return next(new AppError('Product not found', 404));
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

// Update stock for a variant
export const updateStock = async (req, res, next) => {
  try {
    const { variantSku, quantity } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, 'variants.sku': variantSku },
      { $inc: { 'variants.$.stock': quantity } },
      { new: true }
    );

    if (!product) return next(new AppError('Product or variant not found', 404));
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ✅ Low Stock Report
export const getLowStockReport = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold) || 2;

    const products = await Product.find({
      'variants.stock': { $lte: threshold },
    });

    const lowStockItems = products.flatMap((product) =>
      product.variants
        .filter((variant) => variant.stock <= threshold)
        .map((variant) => ({
          productId: product._id,
          productName: product.name,
          variantSku: variant.sku,
          variantStock: variant.stock,
        }))
    );

    res.json(lowStockItems);
  } catch (err) {
    next(err);
  }
};

// ✅ High Stock Report
export const getHighStockReport = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;

    const products = await Product.find({
      'variants.stock': { $gt: threshold },
    });

    const highStockItems = products.flatMap((product) =>
      product.variants
        .filter((variant) => variant.stock > threshold)
        .map((variant) => ({
          productId: product._id,
          productName: product.name,
          variantSku: variant.sku,
          variantStock: variant.stock,
        }))
    );

    res.json(highStockItems);
  } catch (err) {
    next(err);
  }
};
