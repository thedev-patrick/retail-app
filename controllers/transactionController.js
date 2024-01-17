const { log } = require("console");
const db = require("../db");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

exports.getTransactions = async (req, res) => {
  try {
    // Retrieve all transactions from the database
    const allTransactions = await db.query("SELECT * FROM transactions");

    // Check if there are any transactions
    if (allTransactions[0].length > 0) {
      res.status(200).json(allTransactions[0]);
    } else {
      res
        .status(404)
        .json({ status: "error", message: "No transactions found" });
    }
  } catch (error) {
    console.error("Error retrieving transactions from the database:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.verifyTransaction = async (req, res) => {
  const { customer_id } = req.body;

  // Validation checks
  if (!customer_id) {
    return res
      .status(400)
      .json({ status: "error", message: "Customer ID is required" });
  }

  try {
    // Check if the customer_id exists in the database
    const [customerData] = await db.query(
      "SELECT * FROM customers WHERE customer_id = ?",
      [customer_id]
    );

    if (!customerData.length) {
      return res
        .status(404)
        .json({ status: "error", message: "Customer not found" });
    }

    // Process verification
    res
      .status(200)
      .json({
        status: "200",
        message: "Successfully verified",
        ...customerData[0],
      });
  } catch (error) {
    console.error("Error verifying transaction:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.createTransaction = async (req, res) => {
  const { customer_id, company, product, quantity, state, lga, location_code } =
    req.body;

  // Validation checks
  if (
    !customer_id ||
    !company ||
    !product ||
    !quantity ||
    !state ||
    !lga ||
    !location_code
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid data provided" });
  }

  try {
    // Check if the customer_id exists in the database
    const [customerData] = await db.query(
      "SELECT * FROM customers WHERE customer_id = ?",
      [customer_id]
    );

    if (!customerData.length) {
      return res
        .status(404)
        .json({ status: "error", message: "Customer not found" });
    }

    // Generate transaction_ref, price, discount, and final_price (simplified for this example)
    const transaction_ref = uuidv4(); // Generate a unique transaction reference
    const price = 3500; // Price per unit
    const discount = 2; // Discount percentage
    const final_price = price * quantity * ((100 - discount) / 100);
    const created_at = new Date();
    
    // Insert transaction data into the database
    await db.query(
      "INSERT INTO transactions (customer_id, transaction_ref, company, price, discount, final_price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [customer_id, transaction_ref, company, price, discount, final_price, created_at]
    );

    res.status(200).json({ status: "200", transaction_ref, ...req.body });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.generateQRCode = async (req, res) => {
  const { customer_id, payment_reference, product, quantity, amount } =
    req.body;

  // Validation checks
  if (!customer_id || !payment_reference || !product || !quantity || !amount) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid data provided" });
  }

  try {
    // Check if the customer_id and payment_reference exist in the database
    const [customerData] = await db.query(
      "SELECT * FROM customers WHERE customer_id = ?",
      [customer_id]
    );
    const [transactionData] = await db.query(
      "SELECT * FROM transactions WHERE transaction_ref = ?",
      [payment_reference]
    );

    if (!customerData.length || !transactionData.length) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Customer or transaction not found",
        });
    }

    const transactionDetails = {
      customer_id,
      payment_reference,
      product,
      quantity,
      amount,
    };

    const qrCodeText = JSON.stringify(transactionDetails);

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(qrCodeText);

    res.status(200).json({
      status: "success",
      message: "QR code receipt generated successfully",
      data: { payment_reference, amount, qrCodeUrl },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
