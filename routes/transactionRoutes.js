const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/create', transactionController.createTransaction);
router.post('./verifyTransaction', transactionController.verifyTransaction);
router.post('/generateQRCode', transactionController.generateQRCode);

module.exports = router;
