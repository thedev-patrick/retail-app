const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/create', customerController.createCustomer);
router.get('/allCustomers', customerController.getCustomers);

module.exports = router;