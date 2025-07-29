const pool = require('../config/database');

class Customer {
  // Create a new customer
  static async create({ name, email, phone, company, notes, userId }) {
    const query = `
      INSERT INTO customers (name, email, phone, company, notes, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [name, email, phone, company, notes, userId];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all customers for a user with pagination and search
  static async findAll(userId, { page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT * FROM customers 
      WHERE user_id = $1
    `;
    let values = [userId];
    
    if (search) {
      query += ` AND (name ILIKE $${values.length + 1} OR email ILIKE $${values.length + 1})`;
      values.push(`%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
    
    try {
      const result = await pool.query(query, values);
      
      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) FROM customers WHERE user_id = $1';
      let countValues = [userId];
      
      if (search) {
        countQuery += ' AND (name ILIKE $2 OR email ILIKE $2)';
        countValues.push(`%${search}%`);
      }
      
      const countResult = await pool.query(countQuery, countValues);
      const total = parseInt(countResult.rows[0].count);
      
      return {
        customers: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Find customer by ID and user ID
  static async findById(id, userId) {
    const query = 'SELECT * FROM customers WHERE id = $1 AND user_id = $2';
    
    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update customer
  static async update(id, userId, updates) {
    const { name, email, phone, company, notes } = updates;
    const query = `
      UPDATE customers 
      SET name = $1, email = $2, phone = $3, company = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING *;
    `;
    const values = [name, email, phone, company, notes, id, userId];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete customer
  static async delete(id, userId) {
    const query = 'DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if email exists for user (excluding current customer for updates)
  static async emailExists(email, userId, excludeId = null) {
    let query = 'SELECT id FROM customers WHERE email = $1 AND user_id = $2';
    let values = [email, userId];
    
    if (excludeId) {
      query += ' AND id != $3';
      values.push(excludeId);
    }
    
    try {
      const result = await pool.query(query, values);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Customer;