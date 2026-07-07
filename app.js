const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// API Key Middleware
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.API_SECRET) {
    return res.status(403).json({
      message: 'Forbidden: Invalid API Key'
    });
  }

  next();
};

// Mock database
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Coffee Maker', price: 49.99, category: 'Home' }
];

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: process.env.SERVICE_NAME
  });
});

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  res.json(product);
});

// POST create product, protected by API key
app.post('/api/products', checkApiKey, (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and Price are required fields.'
    });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Price must be a positive number.'
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category: category || 'Uncategorized'
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.listen(port, () => {
  console.log(`${process.env.SERVICE_NAME} running on http://localhost:${port}`);
});