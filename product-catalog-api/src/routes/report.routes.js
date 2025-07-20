import express from 'express';
import { getLowStockReport, getHighStockReport } from '../controllers/report.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting endpoints for stock levels
 */

/**
 * @swagger
 * /api/reports/low-stock:
 *   get:
 *     summary: Get low stock report
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: List of products with low stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   stock:
 *                     type: integer
 */
router.get('/low-stock', getLowStockReport);

/**
 * @swagger
 * /api/reports/high-stock:
 *   get:
 *     summary: Get high stock report
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: List of products with high stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   stock:
 *                     type: integer
 */
router.get('/high-stock', getHighStockReport);

export default router;
