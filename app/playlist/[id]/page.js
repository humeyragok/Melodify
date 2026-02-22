'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Player from '@/components/Player'
import Sidebar from '@/components/Sidebar'
import usePlayerStore from '@/store/usePlayerStore'

function PlaylistDetailContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { setSong } = usePlayerStore()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchPlaylist()
    }
  }, [status, params.id])

  const fetchPlaylist = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/playlists/${params.id}`)
      const data = await res.json()
      if (res.ok) {
        setPlaylist(data)
      } else {
        router.push('/library')
      }
    } catch (error) {
      console.error(error)
      router.push('/library')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSong = async (songId) => {
    if (!confirm('Bu şarkıyı playlist\'ten kaldırmak istediğinize emin misiniz?')) {
      return
    }

    try {
      const res = await fetch(`/api/playlists/${params.id}/songs/${songId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchPlaylist()
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!session || !playlist) return null

  const songs = playlist.songs.map(item => item.song)

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <main className="ml-64 pb-32">
        <div className="bg-gradient-to-b from-blue-900 to-black px-8 py-12">
          <div className="flex items-end gap-6">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-2xl">
              <span className="text-8xl">📱</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold mb-2">Playlist</p>
              <h2 className="text-white text-5xl font-bold mb-4">{playlist.name}</h2>
              {playlist.description && (
                <p className="text-gray-300 mb-2">{playlist.description}</p>
              )}
              <p className="text-gray-300">{playlist.user.name} • {songs.length} şarkı</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {songs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-white text-xl font-bold mb-2">Playlist boş</p>
              <p className="text-gray-400 mb-6">Şarkıların yanındaki ➕ butonuna tıklayarak ekle</p>
              <a href="/home" className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition inline-block">
                Şarkıları Keşfet
              </a>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSong(songs[0], songs, 0)}
                className="bg-green-500 text-black font-bold w-14 h-14 rounded-full hover:bg-green-400 transition flex items-center justify-center text-2xl mb-8"
              >
                ▶️
              </button>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition relative group"
                  >
                    <div 
                      onClick={() => setSong(song, songs, index)}
                      className="w-full aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden"
                    >
                      {song.coverImage ? (
                        <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
                      )}
                    </div>
                    
                    <div onClick={() => setSong(song, songs, index)}>
                      <h4 className="text-white font-semibold mb-1 truncate">{song.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{song.artist?.name}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveSong(song.id)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 flex items-center justify-center"
                      title="Playlist'ten kaldır"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Player />
    </div>
  )
}

export default function PlaylistDetailPage() {
  return (
    <SessionProvider>
      <PlaylistDetailContent />
    </SessionProvider>
  )
}