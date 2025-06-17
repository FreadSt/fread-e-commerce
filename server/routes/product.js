const express = require('express');

const { addProduct, updateProduct, deleteProduct, getProduct, getProducts } = require('../controllers/product');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

const router = express.Router();

// POST => /api/products - Добавление нового продукта (только для админов)
router.post('/', verifyTokenAndAdmin, addProduct);

// PATCH => /api/products/:id - Обновление продукта (только для админов)
router.patch('/:id', verifyTokenAndAdmin, updateProduct);

// DELETE => /api/products/:id - Удаление продукта (только для админов)
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);

// GET => /api/products/:id - Получение одного продукта
router.get('/:id', getProduct);

// GET => /api/products - Получение списка продуктов
router.get('/', getProducts);

module.exports = router;
