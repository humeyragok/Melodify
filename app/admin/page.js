'use client'

import { useState, useEffect } from 'react'
import { useSession, SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Player from '@/components/Player'

function AdminContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('songs')
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [songForm, setSongForm] = useState({
    title: '',
    audioUrl: '',
    coverImage: '',
    duration: '',
    artistId: ''
  })
  const [artistForm, setArtistForm] = useState({
    name: '',
    image: '',
    bio: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchSongs()
    fetchArtists()
  }, [])

  const fetchSongs = async () => {
    try {
      const res = await fetch('/api/admin/songs')
      const data = await res.json()
      if (!data.error) setSongs(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchArtists = async () => {
    try {
      const res = await fetch('/api/admin/artists')
      const data = await res.json()
      if (!data.error) setArtists(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddArtist = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artistForm)
      })
      const data = await res.json()
      if (data.error) {
        setMessage('❌ ' + data.error)
      } else {
        setMessage('✅ Sanatçı başarıyla eklendi!')
        setArtistForm({ name: '', image: '', bio: '' })
        fetchArtists()
      }
    } catch (error) {
      setMessage('❌ Hata oluştu')
    }
    setLoading(false)
  }

  const handleAddSong = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songForm)
      })
      const data = await res.json()
      if (data.error) {
        setMessage('❌ ' + data.error)
      } else {
        setMessage('✅ Şarkı başarıyla eklendi!')
        setSongForm({ title: '', audioUrl: '', coverImage: '', duration: '', artistId: '' })
        fetchSongs()
      }
    } catch (error) {
      setMessage('❌ Hata oluştu')
    }
    setLoading(false)
  }

  const handleSeedJamendo = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50 })
      })
      const data = await res.json()
      if (data.error) {
        setMessage('❌ ' + data.error)
      } else {
        setMessage(`✅ ${data.addedSongs} şarkı, ${data.addedArtists} sanatçı eklendi!`)
        fetchSongs()
        fetchArtists()
      }
    } catch (error) {
      setMessage('❌ Hata oluştu')
    }
    setLoading(false)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />

      <main className="ml-64 p-8 pb-32">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Paneli</h1>
          <p className="text-gray-400">{session?.user?.email}</p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Toplam Şarkı</p>
            <p className="text-4xl font-bold text-green-500">{songs.length}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Toplam Sanatçı</p>
            <p className="text-4xl font-bold text-green-500">{artists.length}</p>
          </div>
        </div>

        <div className="mb-8">
          <button
            onClick={handleSeedJamendo}
            disabled={loading}
            className="bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-400 transition disabled:opacity-50"
          >
            {loading ? 'Yükleniyor...' : '🎵 Jamendo\'dan 50 Şarkı Ekle'}
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-6 py-3 rounded-full font-semibold transition ${activeTab === 'songs' ? 'bg-green-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            🎵 Şarkılar
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-6 py-3 rounded-full font-semibold transition ${activeTab === 'artists' ? 'bg-green-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            🎤 Sanatçılar
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.startsWith('✅') ? 'bg-green-500/10 border border-green-500 text-green-500' : 'bg-red-500/10 border border-red-500 text-red-500'}`}>
            {message}
          </div>
        )}

        {activeTab === 'artists' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-6">Sanatçı Ekle</h2>
              <form onSubmit={handleAddArtist} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Sanatçı Adı *</label>
                  <input
                    type="text"
                    placeholder="Sanatçı adı"
                    value={artistForm.name}
                    onChange={(e) => setArtistForm({...artistForm, name: e.target.value})}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Fotoğraf URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={artistForm.image}
                    onChange={(e) => setArtistForm({...artistForm, image: e.target.value})}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Biyografi</label>
                  <textarea
                    placeholder="Sanatçı hakkında..."
                    value={artistForm.bio}
                    onChange={(e) => setArtistForm({...artistForm, bio: e.target.value})}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 h-24 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Sanatçı Ekle'}
                </button>
              </form>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-6">Sanatçılar ({artists.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {artists.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Henüz sanatçı yok</p>
                ) : (
                  artists.map((artist) => (
                    <div key={artist.id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {artist.image ? (
                          <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>🎤</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{artist.name}</p>
                        {artist.bio && <p className="text-gray-400 text-xs truncate">{artist.bio}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'songs' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-6">Şarkı Ekle</h2>
              <form onSubmit={handleAddSong} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Şarkı Adı *</label>
                  <input
                    type="text"
                    placeholder="Şarkı adı"
                    value={songForm.title}
                    onChange={(e) => setSongForm({...songForm, title: e.target.value})}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Sanatçı *</label>
                  <select
                    value={songForm.artistId}
                    onChange={(e) => setSongForm({...songForm, artistId: e.target.value})}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    required
                  >
                    <option value="">Sanatçı seç</option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>{artist.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Audio URL * (MP3 linki)</label>
                  <input
                    type="text"
                    placeholder="https://.../song.mp3"
                    value={songForm.audioUrl}
                    onChange={(e) => setSongForm({...songForm, audioUrl: e.target.value})}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Kapak Görseli URL</label>
                  <input
                    type="text"
                    placeholder="https://.../cover.jpg"
                    value={songForm.coverImage}
                    onChange={(e) => setSongForm({...songForm, coverImage: e.target.value})}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Süre (saniye) *</label>
                  <input
                    type="number"
                    placeholder="örn: 210"
                    value={songForm.duration}
                    onChange={(e) => setSongForm({...songForm, duration: e.target.value})}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || artists.length === 0}
                  className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Şarkı Ekle'}
                </button>
                {artists.length === 0 && (
                  <p className="text-yellow-500 text-sm text-center">⚠️ Önce sanatçı eklemelisiniz!</p>
                )}
              </form>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-6">Şarkılar ({songs.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {songs.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Henüz şarkı yok</p>
                ) : (
                  songs.map((song) => (
                    <div key={song.id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                      <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                        {song.coverImage ? (
                          <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <span>🎵</span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold truncate">{song.title}</p>
                        <p className="text-gray-400 text-xs">{song.artist?.name}</p>
                      </div>
                      <div className="ml-auto text-gray-400 text-xs flex-shrink-0">
                        {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Player />
    </div>
  )
}

export default function AdminPage() {
  return (
    <SessionProvider>
      <AdminContent />
    </SessionProvider>
  )
}