module.exports = {
    customers: {},
    addCustomer: function (customerId, customerData) {
        this.customers[customerId] = customerData;
    },
    getCustomer: function (customerId) {
        return this.customers[customerId];
    },
    addTransaction: function (transactionId, transactionData) {
        this.transactions[transactionId] = transactionData;
    },
    getTransaction: function (transactionId) {
        return this.transactions[transactionId];
    },
    getTransactions: function () {
        return this.transactions;
    },
};
