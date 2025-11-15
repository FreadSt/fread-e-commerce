const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');

module.exports.register = (req, res, next) => {
  // const errors = validationResult(req);
  // !errors.isEmpty() && res.status(400).json({ errors: errors.array() });
  console.log('Registration attempt:', req.body); // Log incoming data
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin || false;
  
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        username,
        email,
        password: hashedPassword,
        isAdmin
      });
      return user.save();
    })
    .then(user => {
      // Generate JWT token after successful registration
      const jwtSecret = process.env.JWT_SECRET_KEY || 'your-secret-jwt-key-change-in-production';
      const token = jwt.sign(
        { id: user._id.toString(), isAdmin: user.isAdmin },
        jwtSecret,
        { expiresIn: '1d' }
      );
      
      res.status(201).json({
        message: 'User is registered successfully.',
        user: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token
      });
    })
    .catch(error => {
      console.error('Registration error:', error);
      // Check for duplicate key error (username or email already exists)
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({ 
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists!` 
        });
      }
      res.status(500).json({ message: 'Server error during registration', error: error.message });
    });
};



{/* LOGIN*/}


module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Находим пользователя
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Username is not valid' });
    }

    // Проверяем пароль
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(400).json({ message: 'Password is not correct' });
    }

    // Генерируем JWT
    const jwtSecret = process.env.JWT_SECRET_KEY || 'your-secret-jwt-key-change-in-production';
    const token = jwt.sign(
      { id: user._id.toString(), isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Возвращаем ответ
    res.status(200).json({
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports.refreshToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const jwtSecret = process.env.JWT_SECRET_KEY || 'your-secret-jwt-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id); // Предполагаем, что у вас есть модель User
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
