import { useState, useEffect, useCallback } from 'react';
import { customerAPI, handleAPIError } from '../utils/api';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  // Fetch customers with pagination and search
  const fetchCustomers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await customerAPI.getCustomers(params);
      const { customers: fetchedCustomers, pagination: paginationData } = response.data;
      
      setCustomers(fetchedCustomers);
      setPagination(paginationData);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new customer
  const createCustomer = async (customerData) => {
    try {
      const response = await customerAPI.createCustomer(customerData);
      const { customer } = response.data;
      
      // Add new customer to the beginning of the list
      setCustomers(prev => [customer, ...prev]);
      
      return { success: true, customer };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Update customer
  const updateCustomer = async (id, customerData) => {
    try {
      const response = await customerAPI.updateCustomer(id, customerData);
      const { customer } = response.data;
      
      // Update customer in the list
      setCustomers(prev => 
        prev.map(c => c.id === id ? customer : c)
      );
      
      return { success: true, customer };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      await customerAPI.deleteCustomer(id);
      
      // Remove customer from the list
      setCustomers(prev => prev.filter(c => c.id !== id));
      
      return { success: true };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Get single customer
  const getCustomer = async (id) => {
    try {
      const response = await customerAPI.getCustomer(id);
      const { customer } = response.data;
      
      return { success: true, customer };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Reset customers list
  const resetCustomers = () => {
    setCustomers([]);
    setError(null);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      pages: 1
    });
  };

  return {
    customers,
    loading,
    error,
    pagination,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    resetCustomers,
    setError
  };
};

// Hook for managing a single customer
export const useCustomer = (id) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await customerAPI.getCustomer(id);
      const { customer: fetchedCustomer } = response.data;
      setCustomer(fetchedCustomer);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return {
    customer,
    loading,
    error,
    refetch: fetchCustomer
  };
};