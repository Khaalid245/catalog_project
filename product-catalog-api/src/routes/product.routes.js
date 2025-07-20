import express from 'express';
import Product from '../models/product.model.js';
import {
  getLowStockReport,
  getHighStockReport,
} from '../controllers/product.controller.js';

const router = express.Router();

/**
 * @swagger
 * /products/report/{type}:
 *   get:
 *     summary: Get stock reports
 *     description: Returns products with low or high stock
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *           enum: [low-stock, high-stock]
 *         required: true
 *         description: Report type
 *     responses:
 *       200:
 *         description: Report generated
 *       400:
 *         description: Invalid report type
 */
router.get('/report/:type', async (req, res, next) => {
  const { type } = req.params;
  try {
    if (type === 'low-stock') {
      return await getLowStockReport(req, res, next);
    } else if (type === 'high-stock') {
      return await getHighStockReport(req, res, next);
    } else {
      return res.status(400).json({ message: 'Invalid report type' });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product fully
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Partially update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     summary: Update product stock only
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product stock updated
 */
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

/**
 * @swagger
 * /products/{id}/variants/{variantId}:
 *   patch:
 *     summary: Update a variant's stock
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Variant stock updated
 */
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

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
