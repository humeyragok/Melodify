'use client'

import { SessionProvider, useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Player from '@/components/Player'
import SongCard from '@/components/SongCard'
import usePlayerStore from '@/store/usePlayerStore'

function HomeContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { setSong } = usePlayerStore()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSongs()
    }
  }, [status])

  const fetchSongs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/songs')
      const data = await res.json()
      setSongs(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-black">
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
          <a href="/search" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">🔍</span>
            <span className="font-semibold">Ara</span>
          </a>
          <a href="/library" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">📚</span>
            <span className="font-semibold">Kitaplığın</span>
          </a>
          <a href="/liked" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">❤️</span>
            <span className="font-semibold">Beğenilenler</span>
          </a>
          <a href="/admin" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
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

      <main className="ml-64 p-8 pb-32">
        <h2 className="text-white text-3xl font-bold mb-8">
          İyi günler, {session?.user?.name}
        </h2>

        <section className="mb-12">
          <h3 className="text-white text-2xl font-bold mb-4">Şarkılar</h3>
          {loading ? (
            <div className="text-white">Yükleniyor...</div>
          ) : songs.length === 0 ? (
            <div className="text-gray-400">
              Henüz şarkı yok. <a href="/admin" className="text-green-500 underline">Admin panelinden</a> şarkı ekleyin.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {songs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  songs={songs}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Player />
    </div>
  )
}

export default function HomePage() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  )
}