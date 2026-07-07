const express = require('express');
const router = express.Router();

let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Coffee Maker', price: 49.99, category: 'Home' }
];

// GET all products
router.get('/', (req, res) => {
  res.json(products);
});

// GET product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
      requestId: req.requestId
    });
  }

  res.json(product);
});

// POST create product
router.post('/', (req, res) => {
  const { name, price, category } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({
      message: 'Name and Price are required.',
      requestId: req.requestId
    });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({
      message: 'Price must be a positive number.',
      requestId: req.requestId
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category: category || 'Uncategorized'
  };

  products.push(newProduct);

  res.status(201).json({
    ...newProduct,
    requestId: req.requestId
  });
});

// PUT update product
router.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
      requestId: req.requestId
    });
  }

  const { name, price, category } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({
      message: 'Validation failed: name, price, and category are required.',
      requestId: req.requestId
    });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({
      message: 'Price must be a positive number.',
      requestId: req.requestId
    });
  }

  product.name = name;
  product.price = price;
  product.category = category;

  res.json({
    ...product,
    requestId: req.requestId
  });
});

// DELETE product
router.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) {
    return res.status(404).json({
      message: 'Product not found',
      requestId: req.requestId
    });
  }

  products.splice(index, 1);

  res.status(204).send();
});

module.exports = router;