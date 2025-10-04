"use client"
import useSWR from 'swr'

export default function AdminPaymentsPage() {
  const { data } = useSWR('admin-payments', () => apiFetch('/payments?all=true'))
  async function apiFetch(path: string) {
    const token = document.cookie.split('token=')[1]?.split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnect-nu4v.onrender.com'}${path}`, { headers: { Authorization: `Bearer ${token}` } })
    return res.json()
  }
  const payments = (data as any)?.data?.payments || []
  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">Payments</h1>
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2">ID</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p: any)=> (
            <tr key={p._id} className="border-t">
              <td className="py-2">{p._id.slice(-6)}</td>
              <td>{p.provider}</td>
              <td>{p.status}</td>
              <td>{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

