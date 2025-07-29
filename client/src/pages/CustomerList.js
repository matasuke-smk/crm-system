import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import Pagination from '../components/Pagination';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, customer: null });
  const [successMessage, setSuccessMessage] = useState('');
  
  const {
    customers,
    loading,
    error,
    pagination,
    fetchCustomers,
    deleteCustomer,
    setError
  } = useCustomers();

  // Fetch customers when page or search changes
  useEffect(() => {
    fetchCustomers({
      page: currentPage,
      search: searchTerm,
      limit: 10
    });
  }, [currentPage, searchTerm, fetchCustomers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchCustomers({
      page: 1,
      search: searchTerm,
      limit: 10
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openDeleteModal = (customer) => {
    setDeleteModal({ isOpen: true, customer });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, customer: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.customer) return;

    const result = await deleteCustomer(deleteModal.customer.id);
    
    if (result.success) {
      setSuccessMessage('Customer deleted successfully');
      closeDeleteModal();
      // If we're on a page with no customers after deletion, go to previous page
      if (customers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      setError(result.error);
      closeDeleteModal();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Customers</h1>
          <Link
            to="/customers/new"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Customer
          </Link>
        </div>

        {/* Success/Error Messages */}
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setSuccessMessage('')}
        />
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')}
        />

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search customers by name or email..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              Search
            </button>
          </form>
        </div>

        {/* Customer List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'No customers found' : 'No customers yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? `No customers match "${searchTerm}". Try a different search term.`
                  : 'Get started by creating your first customer.'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link
                    to="/customers/new"
                    className="btn-primary inline-flex items-center"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add Customer
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-600">
                                  {customer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {customer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.company || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(customer.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/customers/${customer.id}`}
                              className="text-primary-600 hover:text-primary-900"
                              aria-label={`View ${customer.name}`}
                            >
                              View
                            </Link>
                            <Link
                              to={`/customers/${customer.id}/edit`}
                              className="text-gray-600 hover:text-gray-900"
                              aria-label={`Edit ${customer.name}`}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => openDeleteModal(customer)}
                              className="text-red-600 hover:text-red-900"
                              aria-label={`Delete ${customer.name}`}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden">
                <div className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <div key={customer.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {customer.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {customer.email}
                          </p>
                          {customer.company && (
                            <p className="text-sm text-gray-500 truncate">
                              {customer.company}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            Created {formatDate(customer.created_at)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                          >
                            View
                          </Link>
                          <Link
                            to={`/customers/${customer.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(customer)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Customer
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete {deleteModal.customer?.name}? This action cannot be undone.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={closeDeleteModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CustomerList;