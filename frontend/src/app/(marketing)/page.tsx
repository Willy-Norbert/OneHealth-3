export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Healthcare. Anywhere. Anytime.
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              A modern healthcare platform connecting patients, doctors, and hospitals with secure teleconsultation, appointments, prescriptions and more.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="/auth/register" className="btn-primary">Get Started</a>
              <a href="/auth/login" className="btn-outline">Login</a>
            </div>
          </div>
          <div className="relative">
            <img src="/hero-health.svg" alt="Healthcare" className="w-full max-w-xl mx-auto" />
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-gray-900">Features</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[{
              title:'Teleconsultation', desc:'Secure video consultations with doctors.'
            },{ title:'Appointments', desc:'Book and manage appointments easily.'
            },{ title:'Medical Records', desc:'Access your records and lab results securely.'
            }].map((f,i)=> (
              <div key={i} className="p-6 bg-white rounded-xl border">
                <div className="text-lg font-medium text-gray-900">{f.title}</div>
                <p className="mt-2 text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-gray-900">About</h2>
          <p className="mt-4 text-gray-600 max-w-3xl">
            OneHealthline Connect streamlines care delivery with role-based dashboards for patients, doctors, and hospitals. Built with privacy and security by design.
          </p>
        </div>
      </section>

      <section id="contact" className="bg-gray-50 border-t">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
          <p className="mt-4 text-gray-600">Have questions? Reach us at <a href="mailto:support@onehealth.local" className="text-emerald-600 underline">support@onehealth.local</a></p>
        </div>
      </section>
    </>
  )
}



