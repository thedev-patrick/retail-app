const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/create', transactionController.createTransaction);
router.post('/verifyTransaction', transactionController.verifyTransaction);
router.post('/generateQRCode', transactionController.generateQRCode);
router.get('/allTransactions', transactionController.getTransactions);


module.exports = router;
