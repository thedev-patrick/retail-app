const customers = {};
const { log } = require('console');
const dataStore = require('../datastore');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
exports.verifyTransaction = (req, res) => {
    const { customer_id } = req.body;

    // Validation checks
    if (!customer_id) {
        return res.status(400).json({ status: 'error', message: 'Customer ID is required' });
    }

    // Check if the customer_id exists
    const customerData = dataStore.getCustomer(customer_id);
    console.log(customerData);
    if (!customerData) {
        return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    // Process verification
    const customerInfo = dataStore.getCustomer(customer_id);
    const status = "200";
    const message = "Successfully verified";

    res.status(200).json({ status, message, ...customerInfo });
};

exports.createTransaction = (req, res) => {
    const { customer_id, company, product, quantity, state, lga, location_code } = req.body;

    // Validation checks
    if (!customer_id || !company || !product || !quantity || !state || !lga || !location_code) {
        return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
    }

    // Generate transaction_ref, price, discount, and final_price (simplified for this example)
    const transaction_ref = uuidv4(); // Generate a unique transaction reference
    const price = 3500; // Price per unit
    const discount = 2; // Discount percentage
    const final_price = price * quantity * ((100 - discount) / 100);

    dataStore.addTransaction(transaction_ref, {
        customer_id,
        transaction_ref,
        price,
        discount,
        final_price,
    });

    res.status(200).json({ status: '200', transaction_ref, ...dataStore.getTransactions()[transaction_ref] });
};


exports.generateQRCode = async (req, res) => {
    const {customer_id, payment_reference, product, quantity, amount } = req.body;


    // Validation checks
    if (!customer_id || !payment_reference || !product || !quantity || !amount) {
        return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
    }

    // Check if the customer_id and payment_reference exist
    if (!dataStore.getCustomer(customer_id) || !dataStore.getTransaction(payment_reference)) {
        return res.status(404).json({ status: 'error', message: 'Customer or transaction not found' });
    }


    // Fetch transaction details from dataStore or wherever you store it
    const transactionDetails = dataStore.getTransaction(payment_reference);

    if (!transactionDetails) {
        return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    }


    const qrCodeText = JSON.stringify(transactionDetails);

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(qrCodeText);

    res.status(200).json({
        status: 'success',
        message: 'QR code receipt generated successfully',
        data: { payment_reference, amount, qrCodeUrl },
    });
};
