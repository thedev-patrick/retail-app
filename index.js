const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/customers', require('./routes/customerRoutes'));
app.use('/transactions', require('./routes/transactionRoutes'));


// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
