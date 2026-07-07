const express = require('express');
const dotenv = require('dotenv');

const productRoutes = require('./routes/products');
const requestLogger = require('./middleware/logger');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: process.env.SERVICE_NAME || 'product-service',
        requestId: req.requestId
    });
});

app.use('/api/products', productRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        requestId: req.requestId
    });
});

app.use((err, req, res, next) => {
    console.error(`[ID:${req.requestId}]`, err.stack);

    res.status(500).json({
        message: 'Internal Server Error',
        requestId: req.requestId
    });
});

app.listen(port, () => {
    console.log(`${process.env.SERVICE_NAME} running on http://localhost:${port}`);
});