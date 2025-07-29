import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomers';
import { useCustomers } from '../hooks/useCustomers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { customer, loading, error } = useCustomer(id);
  const { deleteCustomer } = useCustomers();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    const result = await deleteCustomer(id);
    
    if (result.success) {
      setSuccessMessage('Customer deleted successfully');
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
    } else {
      setSuccessMessage('');
      // Error will be shown by the error state
    }
    setDeleteModal(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <ErrorMessage message={error} />
          <div className="mt-6">
            <Link
              to="/customers"
              className="inline-flex items-center text-primary-600 hover:text-primary-500"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <ErrorMessage message="Customer not found" />
          <div className="mt-6">
            <Link
              to="/customers"
              className="inline-flex items-center text-primary-600 hover:text-primary-500"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/customers"
                className="inline-flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Customers
              </Link>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/customers/${customer.id}/edit`}
                className="btn-secondary inline-flex items-center"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </Link>
              <button
                onClick={() => setDeleteModal(true)}
                className="btn-danger inline-flex items-center"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <SuccessMessage 
          message={successMessage} 
          onClose={() => setSuccessMessage('')}
          className="mb-6"
        />

        {/* Customer Info Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl font-medium text-primary-600">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {customer.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Customer ID: #{customer.id}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-primary-600 hover:text-primary-500"
                  >
                    {customer.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">
                    {customer.phone ? (
                      <a
                        href={`tel:${customer.phone}`}
                        className="text-primary-600 hover:text-primary-500"
                      >
                        {customer.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Company */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="text-gray-900">
                    {customer.company || (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {customer.notes && (
            <div className="px-6 py-6 border-t border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {customer.notes}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900">
                  {formatDate(customer.created_at)}
                </span>
              </div>
              {customer.created_at !== customer.updated_at && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500">Last updated:</span>
                  <span className="ml-2 text-gray-900">
                    {formatDate(customer.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Delete Customer
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete {customer.name}? This action cannot be undone.
                </p>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={() => setDeleteModal(false)}
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
      </div>
    </Layout>
  );
};

export default CustomerDetail;