'use client'

import { SessionProvider, useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Player from '@/components/Player'

function LibraryContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPlaylists()
    }
  }, [status])

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/playlists')
      const data = await res.json()
      setPlaylists(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPlaylistName,
          description: newPlaylistDesc
        })
      })

      if (res.ok) {
        setNewPlaylistName('')
        setNewPlaylistDesc('')
        setShowModal(false)
        fetchPlaylists()
      }
    } catch (error) {
      console.error(error)
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
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Melodify</h1>
        </div>

        <nav className="space-y-4">
          <Link href="/home" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">🏠</span>
            <span className="font-semibold">Ana Sayfa</span>
          </Link>

          <Link href="/search" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">🔍</span>
            <span className="font-semibold">Ara</span>
          </Link>

          <Link href="/library" className="flex items-center gap-3 text-white hover:text-green-500 transition">
            <span className="text-2xl">📚</span>
            <span className="font-semibold">Kitaplığın</span>
          </Link>

          <Link href="/liked" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">❤️</span>
            <span className="font-semibold">Beğenilenler</span>
          </Link>

          <Link href="/admin" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <span className="text-2xl">⚙️</span>
            <span className="font-semibold">Admin</span>
          </Link>
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

      {/* Main */}
      <main className="ml-64 p-8 pb-32">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-3xl font-bold">Kitaplığın</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-black font-bold px-6 py-3 rounded-full hover:bg-green-400 transition"
          >
            ➕ Playlist Oluştur
          </button>
        </div>

        {loading ? (
          <div className="text-white text-center py-20">Yükleniyor...</div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-white text-xl font-bold mb-2">Henüz playlist yok</p>
            <p className="text-gray-400 mb-6">İlk playlistini oluştur</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-black font-bold px-6 py-3 rounded-full hover:bg-green-400 transition"
            >
              Playlist Oluştur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-5xl">🎵</span>
                </div>
                <p className="text-white font-semibold truncate">{playlist.name}</p>
                <p className="text-gray-400 text-sm">
                  {playlist._count?.songs || 0} şarkı
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-white text-2xl font-bold mb-4">Yeni Playlist</h3>

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <input
                type="text"
                placeholder="Playlist Adı"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                required
              />

              <textarea
                placeholder="Açıklama"
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 h-24 resize-none"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-full"
                >
                  İptal
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-black py-3 rounded-full"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Player />
    </div>
  )
}

export default function LibraryPage() {
  return (
    <SessionProvider>
      <LibraryContent />
    </SessionProvider>
  )
}