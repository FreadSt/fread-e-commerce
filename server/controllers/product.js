const Product = require('../models/Product');

module.exports.addProduct = async (req, res) => {

  try {
    const { title, description, categories, size, color, price, inStock } = req.body;

    // Проверка обязательных полей
    if (!title || !description || !price) {
      return res.status(400).json({ message: 'Missing required fields: title, desc, or price' });
    }

    // Обработка данных
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const parsedCategories = typeof categories === 'string' ? JSON.parse(categories || '[]') : (categories || []);
    const parsedSize = typeof size === 'string' ? JSON.parse(size || '[]') : (size || []);
    const parsedColor = typeof color === 'string' ? JSON.parse(color || '[]') : (color || []);

    const newProduct = new Product({
      title,
      description,
      image: imagePath,
      categories: parsedCategories,
      size: parsedSize,
      color: parsedColor,
      price: parseFloat(price),
      inStock: inStock === 'true' || inStock === true,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: 'Product added successfully.',
      product: savedProduct,
    });
  } catch (err) {
    console.error('Error adding product:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + err.message });
    }
    res.status(500).json({ message: 'Error adding product: ' + err.message });
  }
};

// ... остальные методы (updateProduct, deleteProduct, getProduct, getProducts) остаются без изменений

module.exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      {
        new: true
      });
    res.status(200).json({
      message: "Product is updated successfully.",
      updatedProduct
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Product is deleted successfully."
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getProducts = async (req, res) => {
  const newQuery = req.query.new;
  const categoryQuery = req.query.category;
  try {
    let products;
    if (newQuery) {
      products = await Product.find().sort({ createdAt: -1 }).limit(8);
    } else if (categoryQuery) {
      products = await Product.find({ categories: categoryQuery }); // Фильтрация по массиву categories
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};
