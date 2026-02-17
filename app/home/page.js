'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Melodify</h1>
        </div>

        <nav className="space-y-4">
          <a href="/home" className="flex items-center gap-3 text-white hover:text-green-500 transition">
            <span className="text-2xl">🏠</span>
            <span className="font-semibold">Ana Sayfa</span>
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">🔍</span>
            <span className="font-semibold">Ara</span>
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">📚</span>
            <span className="font-semibold">Kitaplığın</span>
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">❤️</span>
            <span className="font-semibold">Beğenilen Şarkılar</span>
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

      {/* Main Content */}
      <main className="ml-64 p-8">
        <h2 className="text-white text-3xl font-bold mb-8">
          İyi günler, {session?.user?.name}
        </h2>

        {/* Recently Played */}
        <section className="mb-12">
          <h3 className="text-white text-2xl font-bold mb-4">Son Çalınanlar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition group"
              >
                <div className="w-full aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">🎵</span>
                </div>
                <h4 className="text-white font-semibold mb-1 truncate">Şarkı Adı {item}</h4>
                <p className="text-gray-400 text-sm truncate">Sanatçı Adı</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Playlists */}
        <section>
          <h3 className="text-white text-2xl font-bold mb-4">Popüler Playlistler</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-green-500 to-green-700 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-5xl">🎧</span>
                </div>
                <h4 className="text-white font-semibold mb-1 truncate">Playlist {item}</h4>
                <p className="text-gray-400 text-sm truncate">50 şarkı</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
            <div>
              <p className="text-white font-semibold">Şarkı Çalmıyor</p>
              <p className="text-gray-400 text-sm">Bir şarkı seç</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white text-2xl">⏮️</button>
            <button className="bg-white text-black hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
              ▶️
            </button>
            <button className="text-gray-400 hover:text-white text-2xl">⏭️</button>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white text-xl">🔊</button>
          </div>
        </div>
      </div>
    </div>
  )
}