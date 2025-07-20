import Product from '../models/product.model.js';
import AppError from '../utils/appError.js';

export const getLowStockReport = async (req, res, next) => {
  try {
    const threshold = req.query.threshold || 5;
    const products = await Product.find({
      $or: [
        { 'variants.stock': { $lte: threshold } },
        { stock: { $lte: threshold } }
      ]
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getHighStockReport = async (req, res, next) => {
  try {
    const threshold = req.query.threshold || 100;
    const products = await Product.find({
      $or: [
        { 'variants.stock': { $gt: threshold } },
        { stock: { $gt: threshold } }
      ]
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};
