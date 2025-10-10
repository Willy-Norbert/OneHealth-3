"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Emergency = {
  _id: string;
  emergencyType: string;
  severity: string;
  description?: string;
  status?: string;
  createdAt?: string;
};

export default function HospitalEmergencyPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${ " https://onehealthconnekt.onrender.com"}/emergencies`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch emergencies (${res.status})`);
        }
        const data = await res.json();
        // Expecting { status: 'success', data: [...] }
        setEmergencies(Array.isArray(data?.data) ? data.data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to load emergencies");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Emergency Dashboard</h1>
        <Link href="/hospital" className="text-blue-600 hover:underline">
          ← Back to Hospital
        </Link>
      </div>

      {loading && <p>Loading emergencies…</p>}
      {error && (
        <p className="text-red-600">{error} — ensure you are logged in and have access.</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencies.length === 0 && (
            <div className="p-6 border rounded-lg bg-gray-50">No emergencies found.</div>
          )}
          {emergencies.map((e) => (
            <div key={e._id} className="p-6 border rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium capitalize">{e.emergencyType}</h2>
                <span className="text-sm px-2 py-1 rounded bg-gray-100">{e.severity}</span>
              </div>
              {e.description && <p className="mt-2 text-gray-700">{e.description}</p>}
              <div className="mt-3 text-sm text-gray-500">
                <span>Status: {e.status || "unknown"}</span>
                {e.createdAt && <span className="ml-3">Created: {new Date(e.createdAt).toLocaleString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}












