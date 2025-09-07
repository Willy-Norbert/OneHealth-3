"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Item = { href: string; label: string }

export function Sidebar({ items }: { items: Item[] }) {
  const pathname = usePathname()
  return (
    <aside className="h-full w-64 shrink-0 bg-navy text-white">
      <div className="p-4 text-lg font-semibold">OneHealthline</div>
      <nav className="px-2">
        {items.map(i => (
          <Link key={i.href} href={i.href as any} className={`block rounded-md px-3 py-2 text-sm hover:bg-white/10 ${pathname===i.href? 'bg-white/10' : ''}`}>{i.label}</Link>
        ))}
      </nav>
    </aside>
  )
}

