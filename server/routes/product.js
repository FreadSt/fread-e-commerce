const express = require('express');
const { addProduct, updateProduct, deleteProduct, getProduct, getProducts } = require('../controllers/product');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const multer = require('multer');

const router = express.Router();

// Настройка хранения файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Папка для сохранения файлов (относительно server/)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Уникальное имя файла
  },
});

const upload = multer({ storage: storage });

router.post('/add', verifyTokenAndAdmin, upload.single('image'), addProduct);

// PATCH => /api/products/:id - Обновление продукта
router.patch('/:id', verifyTokenAndAdmin, updateProduct);

// DELETE => /api/products/:id - Удаление продукта
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);

// GET => /api/products/:id - Получение одного продукта
router.get('/:id', getProduct);

// GET => /api/products - Получение списка продуктов
router.get('/', getProducts);

module.exports = router;
