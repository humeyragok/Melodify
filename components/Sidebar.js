'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">🎵</span>
        </div>
        <h1 className="text-white text-2xl font-bold">Melodify</h1>
      </div>

      <nav className="space-y-4">
        <a 
          href="/home" 
          className={`flex items-center gap-3 transition ${
            isActive('/home') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-2xl">🏠</span>
          <span className="font-semibold">Ana Sayfa</span>
        </a>
        <a 
          href="/search" 
          className={`flex items-center gap-3 transition ${
            isActive('/search') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-2xl">🔍</span>
          <span className="font-semibold">Ara</span>
        </a>
        <a 
          href="/library" 
          className={`flex items-center gap-3 transition ${
            isActive('/library') || pathname?.startsWith('/playlist') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-2xl">📚</span>
          <span className="font-semibold">Kitaplığın</span>
        </a>
        <a 
          href="/liked" 
          className={`flex items-center gap-3 transition ${
            isActive('/liked') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-2xl">❤️</span>
          <span className="font-semibold">Beğenilenler</span>
        </a>
        <a 
          href="/admin" 
          className={`flex items-center gap-3 transition ${
            isActive('/admin') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-2xl">⚙️</span>
          <span className="font-semibold">Admin</span>
        </a>
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <p className="text-white text-sm mb-2">👋 Hoş geldin</p>
          <p className="text-green-500 font-semibold">{session?.user?.name}</p>
          <p className="text-gray-400 text-xs">{session?.user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2 rounded-full transition"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}