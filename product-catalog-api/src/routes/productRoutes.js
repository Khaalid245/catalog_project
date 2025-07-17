import express from 'express';
import {
  createProduct,
  getProducts,
  updateStock
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.patch('/stock', updateStock);

export default router;