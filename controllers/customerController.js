const db = require('../db');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const customers = {};

// Assuming you have a database connection pool, replace it with your actual database library

exports.createCustomer = async (req, res) => {
    const { mobile_no, nin } = req.body;

    // Validation checks
    if (!mobile_no || !nin) {
        return res.status(400).json({ status: 'error', message: 'Mobile number and NIN are required' });
    }

    // Additional checks if needed, e.g., format, length, uniqueness, etc.

    // Generate customer_id, customer_name, and created_at
    const customer_id = `PL${uuidv4()}`; // Generate a unique ID
    const customer_name = faker.person.fullName();
    const created_at = new Date();

    const customerData = { customer_name, created_at };

    try {
        // Check if the customer already exists based on mobile_no or nin
        const existingCustomer = await db.query(
            'SELECT * FROM customers WHERE mobile_no = ? OR nin = ?',
            [mobile_no, nin]
        );

        if (existingCustomer.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Customer with the same mobile number or NIN already exists' });
        }

        // Insert customer data into the database
        await db.query('INSERT INTO customers (customer_id, customer_name, mobile_no, nin, created_at) VALUES (?, ?, ?, ?, ?)', [
            customer_id,
            customer_name,
            mobile_no,
            nin,
            created_at,
        ]);

        // Optionally, you can update your dataStore module if needed
        // dataStore.addCustomer(customer_id, customerData);

        res.status(201).json({ customer_id, customer_name, mobile_no, nin, created_at });
    } catch (error) {
        console.error('Error inserting customer into the database:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
