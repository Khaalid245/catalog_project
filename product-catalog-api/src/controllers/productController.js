import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  const filter = {};
  
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter).populate('category');
  res.json(products);
};

export const updateStock = async (req, res) => {
  const { productId, variantSku, stockChange } = req.body;
  const product = await Product.findOneAndUpdate(
    { _id: productId, 'variants.sku': variantSku },
    { $inc: { 'variants.$.stock': stockChange } },
    { new: true }
  );
  res.json(product);
};