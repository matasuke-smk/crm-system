import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCustomers } from '../hooks/useCustomers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  UsersIcon, 
  PlusIcon, 
  EyeIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { customers, loading, fetchCustomers } = useCustomers();

  useEffect(() => {
    fetchCustomers({ limit: 5 }); // Get recent 5 customers for dashboard
  }, [fetchCustomers]);

  const stats = [
    {
      name: 'Total Customers',
      value: customers.length,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'This Month',
      value: customers.filter(customer => {
        const customerDate = new Date(customer.created_at);
        const now = new Date();
        return customerDate.getMonth() === now.getMonth() && 
               customerDate.getFullYear() === now.getFullYear();
      }).length,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your customer management today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-md ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            stat.value
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/customers/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PlusIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Add Customer</h3>
                <p className="text-sm text-gray-500">Create a new customer record</p>
              </div>
            </Link>
            
            <Link
              to="/customers"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <EyeIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">View All Customers</h3>
                <p className="text-sm text-gray-500">Browse your customer database</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Customers</h2>
              <Link
                to="/customers"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          
          <div className="px-6 py-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No customers yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first customer.
                </p>
                <div className="mt-6">
                  <Link
                    to="/customers/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Customer
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {customers.slice(0, 5).map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
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
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;