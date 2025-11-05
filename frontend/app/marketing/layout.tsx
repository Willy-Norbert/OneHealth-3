import { MedicalTexture } from "@/components/ui/MedicalTexture"

export const metadata = {
  title: 'OneHealthline Connect',
  description: 'Modern healthcare platform with patient, doctor, hospital dashboards',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b bg-emerald-50/95 backdrop-blur relative overflow-hidden">
        <MedicalTexture pattern="hospital" opacity={0.03} className="text-emerald-600" />
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-gray-900 font-semibold">
            <img src="/logo.png" alt="OneHealthline" className="h-8 w-8" />
            <span>OneHealthline</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#about" className="hover:text-gray-900">About</a>
            <a href="#contact" className="hover:text-gray-900">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/auth/login" className="btn-outline">Login</a>
            <a href="/auth/register" className="btn-primary">Get Started</a>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} OneHealthline Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}





