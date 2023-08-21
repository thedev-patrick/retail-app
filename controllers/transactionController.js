const transactions = {};
const uuid = require('uuid').v4;

exports.verifyTransaction = (req, res) => {
    const { customer_id } = req.body;

    // Validation checks
    if (!customer_id) {
        return res.status(400).json({ status: 'error', message: 'Customer ID is required' });
    }

    // Check if the customer_id exists
    if (!customers[customer_id]) {
        return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    // Process verification
    const customerInfo = customers[customer_id];
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
    const transaction_ref = uuid(); // Generate a unique transaction reference
    const price = 3500; // Price per unit
    const discount = 2; // Discount percentage
    const final_price = price * quantity * ((100 - discount) / 100);

    transactions[transaction_ref] = {
        customer_id,
        transaction_ref,
        price,
        discount,
        final_price,
    };

    res.status(200).json({ status: '200', transaction_ref, ...transactions[transaction_ref] });
};

exports.generateQRCode = (req, res) => {
    const { customer_id, payment_reference, product, quantity, amount } = req.body;

    // Validation checks
    if (!customer_id || !payment_reference || !product || !quantity || !amount) {
        return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
    }

    // Check if the customer_id and payment_reference exist
    if (!customers[customer_id] || !transactions[payment_reference]) {
        return res.status(404).json({ status: 'error', message: 'Customer or transaction not found' });
    }

    // Generate a unique transaction ID
    const transactionId = uuid();

    // In a real application, you would generate a QR code image and store it.
    const qrCodeUrl = `https://example.com/qrcodes/${transactionId}.png`;

    res.status(200).json({
        status: 'success',
        message: 'QR code receipt generated successfully',
        data: { transactionId, amount, qrCodeUrl },
    });
};
