'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Player from '@/components/Player'
import Sidebar from '@/components/Sidebar'
import SongCard from '@/components/SongCard'

function HomeContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
      <Sidebar />

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