const customers = {};
const uuid = require('uuid').v4;

exports.createCustomer = (req, res) => {
    const { mobile_no, nin } = req.body;

    // Validation checks
    if (!mobile_no || !nin) {
        return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
    }

    // Generate customer_id, customer_name, and created_at
    const customer_id = `PL${uuid()}`; // Generate a unique ID
    const customer_name = "Abdul Sam";
    const created_at = "28-05-2023";

    customers[customer_id] = { customer_name, created_at };

    res.status(201).json({ customer_id, customer_name, created_at });
};
