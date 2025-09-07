"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function OrdersPage() {
  const { user } = useAuth()
  const { data: orders } = useSWR(() => user ? `orders-${user.id}` : null, () => api.orders.my(user!.id) as any)
  const [selectedStatus, setSelectedStatus] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: '📦' },
    { value: 'pending', label: 'Pending', icon: '⏳' },
    { value: 'processing', label: 'Processing', icon: '🔄' },
    { value: 'shipped', label: 'Shipped', icon: '🚚' },
    { value: 'delivered', label: 'Delivered', icon: '✅' },
    { value: 'cancelled', label: 'Cancelled', icon: '❌' }
  ]

  const stats = {
    total: orders?.data?.orders?.length || 0,
    pending: orders?.data?.orders?.filter((o: any) => o.status === 'pending').length || 0,
    processing: orders?.data?.orders?.filter((o: any) => o.status === 'processing').length || 0,
    delivered: orders?.data?.orders?.filter((o: any) => o.status === 'delivered').length || 0
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'badge-warning'
      case 'processing':
        return 'badge-primary'
      case 'shipped':
        return 'badge-info'
      case 'delivered':
        return 'badge-success'
      case 'cancelled':
        return 'badge-danger'
      default:
        return 'badge-gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '⏳'
      case 'processing':
        return '🔄'
      case 'shipped':
        return '🚚'
      case 'delivered':
        return '✅'
      case 'cancelled':
        return '❌'
      default:
        return '📦'
    }
  }

  return (
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/patient/appointments', label: 'Appointments' },
        { href: '/patient/teleconsult', label: 'Teleconsultation' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your medication and healthcare orders</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Processing</p>
                <p className="stat-value">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Delivered</p>
                <p className="stat-value">{stats.delivered}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
            <p className="text-sm text-gray-500">Select a status to view specific types of orders</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    selectedStatus === status.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{status.icon}</div>
                  <div className="text-sm font-medium">{status.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
            <p className="text-sm text-gray-500">View and track your medication orders</p>
          </div>
          <div className="card-body">
            {orders?.data?.orders?.length > 0 ? (
              <div className="space-y-4">
                {orders.data.orders
                  .filter((order: any) => selectedStatus === 'all' || order.status === selectedStatus)
                  .map((order: any) => (
                    <div key={order._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">{getStatusIcon(order.status)}</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                Order #{order._id?.slice(-6)}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()} • ${order.totalAmount || '0.00'}
                              </p>
                            </div>
                            <span className={`badge ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><span className="font-medium">Order Type:</span> {order.type || 'Medication'}</p>
                              <p><span className="font-medium">Pharmacy:</span> {order.pharmacy?.name || 'Not specified'}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Payment:</span> {order.paymentMethod || 'Credit Card'}</p>
                              <p><span className="font-medium">Delivery:</span> {order.deliveryMethod || 'Standard'}</p>
                            </div>
                          </div>

                          {order.items && order.items.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                              <div className="space-y-1">
                                {order.items.map((item: any, index: number) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.name || `Item ${index + 1}`}</span>
                                    <span className="font-medium">${item.price || '0.00'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {order.trackingNumber && (
                            <div className="mt-3 p-3 bg-white rounded-lg">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <button className="btn-primary btn-sm">
                            View Details
                          </button>
                          {order.status === 'shipped' && (
                            <button className="btn-outline btn-sm">
                              Track Package
                            </button>
                          )}
                          {order.status === 'pending' && (
                            <button className="btn-danger btn-sm">
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">New Order</h3>
            <p className="text-sm text-gray-500 mb-4">Place a new medication order</p>
            <button className="btn-primary w-full">
              Place Order
            </button>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reorder</h3>
            <p className="text-sm text-gray-500 mb-4">Quickly reorder previous medications</p>
            <button className="btn-success w-full">
              Reorder Items
            </button>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Pharmacy</h3>
            <p className="text-sm text-gray-500 mb-4">Locate nearby pharmacies for pickup</p>
            <button className="btn-outline w-full">
              Find Pharmacies
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

