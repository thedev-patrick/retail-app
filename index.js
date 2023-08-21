const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const QRCode = require('qrcode');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/customers', require('./routes/customerRoutes'));
app.use('/transactions', require('./routes/transactionRoutes'));
app.get('/generate-qrcode/:transactionId', async (req, res) => {
    try {
      const { transactionId } = req.params;
  
      // Fetch transaction details from dataStore or wherever you store it
      const transactionDetails = dataStore.getTransaction(transactionId);
      if (!transactionDetails) {
        return res.status(404).json({ status: 'error', message: 'Transaction not found' });
      }
  
      const qrCodeText = JSON.stringify(transactionDetails);
  
      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(qrCodeText);
  
      res.status(200).json({ qrCodeUrl });
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });
  

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
