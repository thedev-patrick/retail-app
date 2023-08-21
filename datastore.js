module.exports = {
    customers: {},
    transactions: {}, // Initialize the transactions object
    addCustomer: function(customerId, customerData) {
      this.customers[customerId] = customerData;
    },
    getCustomer: function(customerId) {
      return this.customers[customerId];
    },
    addTransaction: function(transactionId, transactionData) {
      // Make sure transactions[transactionId] is properly initialized
      if (!this.transactions[transactionId]) {
        this.transactions[transactionId] = {};
      }
  
      Object.assign(this.transactions[transactionId], transactionData);
    },
    getTransaction: function(transactionId) {
      return this.transactions[transactionId];
    },
    getTransactions: function() {
      return this.transactions;
    },
  };
  