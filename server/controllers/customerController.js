const Customer = require('../models/Customer');

class CustomerController {
  // Get all customers with pagination and search
  static async getCustomers(req, res, next) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await Customer.findAll(userId, { page, limit, search });

      res.json({
        message: 'Customers retrieved successfully',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single customer by ID
  static async getCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const customer = await Customer.findById(id, userId);
      
      if (!customer) {
        return res.status(404).json({
          error: 'Customer not found',
          message: 'The requested customer does not exist'
        });
      }

      res.json({
        message: 'Customer retrieved successfully',
        customer
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new customer
  static async createCustomer(req, res, next) {
    try {
      const { name, email, phone, company, notes } = req.body;
      const userId = req.user.id;

      // Check if email already exists for this user
      const emailExists = await Customer.emailExists(email, userId);
      if (emailExists) {
        return res.status(409).json({
          error: 'Email already exists',
          message: 'A customer with this email already exists'
        });
      }

      const customer = await Customer.create({
        name,
        email,
        phone,
        company,
        notes,
        userId
      });

      res.status(201).json({
        message: 'Customer created successfully',
        customer
      });
    } catch (error) {
      next(error);
    }
  }

  // Update customer
  static async updateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updates = req.body;

      // Check if customer exists
      const existingCustomer = await Customer.findById(id, userId);
      if (!existingCustomer) {
        return res.status(404).json({
          error: 'Customer not found',
          message: 'The requested customer does not exist'
        });
      }

      // If email is being updated, check if it already exists
      if (updates.email && updates.email !== existingCustomer.email) {
        const emailExists = await Customer.emailExists(updates.email, userId, id);
        if (emailExists) {
          return res.status(409).json({
            error: 'Email already exists',
            message: 'A customer with this email already exists'
          });
        }
      }

      // Use existing values for fields not provided in update
      const customerData = {
        name: updates.name || existingCustomer.name,
        email: updates.email || existingCustomer.email,
        phone: updates.phone !== undefined ? updates.phone : existingCustomer.phone,
        company: updates.company !== undefined ? updates.company : existingCustomer.company,
        notes: updates.notes !== undefined ? updates.notes : existingCustomer.notes
      };

      const customer = await Customer.update(id, userId, customerData);

      res.json({
        message: 'Customer updated successfully',
        customer
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete customer
  static async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const customer = await Customer.delete(id, userId);
      
      if (!customer) {
        return res.status(404).json({
          error: 'Customer not found',
          message: 'The requested customer does not exist'
        });
      }

      res.json({
        message: 'Customer deleted successfully',
        customer
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CustomerController;