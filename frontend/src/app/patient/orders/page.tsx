"use client"
import useSWR from 'swr'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

export default function OrdersPage() {
  const { user } = useAuth()
  const { data } = useSWR(() => user ? `orders-${user.id}` : null, () => api.orders.my(user!.id) as any)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-navy">My Orders</h1>
      <div className="card p-6">
        <ul className="space-y-3">
          {(data as any)?.data?.orders?.map((o: any)=> (
            <li key={o._id} className="rounded border p-3">
              <div className="font-medium">Order #{o._id.slice(-6)}</div>
              <div className="text-sm text-slate-600">Status: {o.status}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

