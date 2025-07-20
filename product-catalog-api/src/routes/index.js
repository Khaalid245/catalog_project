import express from 'express';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import reportRoutes from './report.routes.js';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/reports', reportRoutes);

export default router;