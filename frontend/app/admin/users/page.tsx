"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function UsersPage() {
  const { data, mutate } = useSWR('users-admin', () => apiFetch('/users'))

  async function apiFetch(path: string) {
    const res = await fetch(`${ ' http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io'}${path}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}` }, cache: 'no-store' })
    return res.json()
  }

  const changeRole = async (id: string, role: string) => {
    await fetch(`${ ' http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io'}/users/${id}/role`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}` }, body: JSON.stringify({ role }) })
    mutate()
  }

  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">Users</h1>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.users?.map((u: any)=> (
            <tr key={u._id} className="border-t">
              <td className="py-2">{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select defaultValue={u.role} onChange={e=>changeRole(u._id, e.target.value)} className="rounded border px-2 py-1 text-sm">
                  <option value="patient">patient</option>
                  <option value="doctor">doctor</option>
                  <option value="hospital">hospital</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

