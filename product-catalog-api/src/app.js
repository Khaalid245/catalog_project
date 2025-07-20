import express from 'express';
import Product from './models/product.model.js';
import categoryRoutes from './routes/category.routes.js';
import reportRoutes from './routes/report.routes.js';
import router from './routes/index.js';
import setupSwagger from './swagger.js';
import connectDB from './config/db.config.js';
const app = express(); // ✅ Add this to define 'app'
app.use(express.json()); // ✅ To parse JSON


// Create a product
router.post('/', async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    next(err);
  }
});

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// Get a single product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Full update (PUT)
router.put('/:id', async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// PATCH partial product fields
router.patch('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// PATCH only stock
router.patch('/:id/stock', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.body.stock !== undefined) {
      product.stock = req.body.stock;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// PATCH a variant's stock
router.patch('/:id/variants/:variantId', async (req, res, next) => {
  try {
    const { id, variantId } = req.params;
    const { stock } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });

    if (stock !== undefined) {
      variant.stock = stock;
    }

    await product.save();
    res.json({ message: 'Variant stock updated successfully', variant });
  } catch (err) {
    next(err);
  }
});

// Delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
});
app.use('/api/categories', categoryRoutes);
app.use('/api/products', router);
setupSwagger(app); 

// app.use('/reports', reportRoutes);
// app.use('/categories', router);
// app.use('/api/products/', productRoutes);


export default app; // ✅ Now 'app' is correctly exported
