const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const { authenticateToken } = require('../middleware/auth');
const { validateCustomer, validateCustomerUpdate } = require('../middleware/validation');

// Apply authentication to all customer routes
router.use(authenticateToken);

// @route   GET /api/customers
// @desc    Get all customers with pagination and search
// @access  Private
router.get('/', CustomerController.getCustomers);

// @route   GET /api/customers/:id
// @desc    Get single customer by ID
// @access  Private
router.get('/:id', CustomerController.getCustomer);

// @route   POST /api/customers
// @desc    Create new customer
// @access  Private
router.post('/', validateCustomer, CustomerController.createCustomer);

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put('/:id', validateCustomerUpdate, CustomerController.updateCustomer);

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private
router.delete('/:id', CustomerController.deleteCustomer);

module.exports = router;