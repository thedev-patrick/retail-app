const dataStore = require('../datastore');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const customers = {};

exports.createCustomer = (req, res) => {
    const { mobile_no, nin } = req.body;

    // Validation checks
    if (!mobile_no || !nin) {
        return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
    }

    // Generate customer_id, customer_name, and created_at
    const customer_id = `PL${uuidv4()}`; // Generate a unique ID
    const customer_name = faker.person.fullName(); 
    const created_at = new Date();

    const customerData = { customer_name, created_at };

    dataStore.addCustomer(customer_id, customerData);

    res.status(201).json({ customer_id, customer_name, created_at });
};
