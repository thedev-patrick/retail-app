const db = require("../db");
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");
const customers = {};

// Assuming you have a database connection pool, replace it with your actual database library

exports.createCustomer = async (req, res) => {
  const { mobile_no, nin } = req.body;
  console.log("Request Body:", req.body);

  // Validation checks
  if (!mobile_no || !nin) {
    console.log("Validation Error: Mobile number and NIN are required");
    return res
      .status(400)
      .json({ status: "error", message: "Mobile number and NIN are required" });
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
      "SELECT * FROM customers WHERE mobile_no = ? OR nin = ?",
      [mobile_no, nin]
    );

    console.log(existingCustomer[0].length);
    if (existingCustomer[0].length == 0) {
      // Insert customer data into the database
      await db.query(
        "INSERT INTO customers (customer_id, customer_name, mobile_no, nin, created_at) VALUES (?, ?, ?, ?, ?)",
        [customer_id, customer_name, mobile_no, nin, created_at]
      );
      res
        .status(201)
        .json({ customer_id, customer_name, mobile_no, nin, created_at });
    } else {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Customer with the same mobile number or NIN already exists",
        });
    }

  } catch (error) {
    console.error("Error inserting customer into the database:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.getCustomers = async(req, res) => {
   try {
     // Retrieve all customers from the database
     const allCustomers = await db.query("SELECT * FROM customers");

     // Check if there are any customers
     if (allCustomers[0].length > 0) {
       res.status(200).json(allCustomers[0]);
     } else {
       res.status(404).json({ status: "error", message: "No customers found" });
     }
   } catch (error) {
     console.error("Error retrieving customers from the database:", error);
     res
       .status(500)
       .json({ status: "error", message: "Internal server error" });
   }
}