import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-3xl p-8 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-2xl font-bold">OH</span>
        </div>
        <h1 className="text-2xl font-semibold text-navy">OneHealthline Connect</h1>
        <p className="mt-2 text-slate-600">Sign in to continue.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/auth/login" className="btn-primary">Login</Link>
          <Link href="/auth/register" className="inline-flex items-center justify-center rounded-lg border px-4 py-2 font-medium text-navy border-navy/20">Register</Link>
        </div>
      </div>
    </main>
  )
}

