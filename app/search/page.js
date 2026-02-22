'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Player from '@/components/Player'
import Sidebar from '@/components/Sidebar'
import usePlayerStore from '@/store/usePlayerStore'

function SearchContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { setSong } = usePlayerStore()
  const [query, setQuery] = useState('')
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch()
      } else {
        setSongs([])
        setArtists([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSongs(data.songs || [])
      setArtists(data.artists || [])
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
        <h2 className="text-white text-3xl font-bold mb-6">Ara</h2>

        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          <input
            type="text"
            placeholder="Şarkı veya sanatçı ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-full px-12 py-4 text-lg focus:outline-none focus:border-green-500"
            autoFocus
          />
        </div>

        {loading && (
          <div className="text-white text-center py-20">Aranıyor...</div>
        )}

        {!loading && query.length >= 2 && (
          <div>
            {artists.length > 0 && (
              <section className="mb-10">
                <h3 className="text-white text-xl font-bold mb-4">Sanatçılar</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {artists.map((artist) => (
                    <div key={artist.id} className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition text-center">
                      <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-3 overflow-hidden">
                        {artist.image ? (
                          <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🎤</div>
                        )}
                      </div>
                      <p className="text-white font-semibold truncate">{artist.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {songs.length > 0 && (
              <section>
                <h3 className="text-white text-xl font-bold mb-4">Şarkılar</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {songs.map((song, index) => (
                    <div
                      key={song.id}
                      onClick={() => setSong(song, songs, index)}
                      className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition"
                    >
                      <div className="w-full aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden">
                        {song.coverImage ? (
                          <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
                        )}
                      </div>
                      <h4 className="text-white font-semibold mb-1 truncate">{song.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{song.artist?.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {songs.length === 0 && artists.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">Sonuç bulunamadı</p>
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎵</p>
            <p className="text-white text-2xl font-bold mb-2">Ne dinlemek istersin?</p>
            <p className="text-gray-400">Şarkı veya sanatçı adı yaz</p>
          </div>
        )}
      </main>

      <Player />
    </div>
  )
}

export default function SearchPage() {
  return (
    <SessionProvider>
      <SearchContent />
    </SessionProvider>
  )
}