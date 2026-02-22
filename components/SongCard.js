'use client'

import { useState, useEffect } from 'react'
import usePlayerStore from '@/store/usePlayerStore'

export default function SongCard({ song, songs, index }) {
  const { setSong } = usePlayerStore()
  const [showMenu, setShowMenu] = useState(false)
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const res = await fetch('/api/playlists')
      const data = await res.json()
      setPlaylists(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: song.id })
      })

      if (res.ok) {
        alert('Şarkı playlist\'e eklendi!')
        setShowMenu(false)
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      console.error(error)
      alert('Hata oluştu')
    }
  }

  return (
    <div
      onClick={() => setSong(song, songs, index)}
      className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition group relative"
    >
      <div className="w-full aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {song.coverImage ? (
          <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🎵</span>
        )}
      </div>
      <h4 className="text-white font-semibold mb-1 truncate">{song.title}</h4>
      <p className="text-gray-400 text-sm truncate">{song.artist?.name}</p>

      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(!showMenu)
        }}
        className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
      >
        ➕
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(false)
            }}
          ></div>
          <div className="absolute top-12 right-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 w-48">
            <div className="p-2">
              {playlists.length === 0 ? (
                <p className="text-gray-400 text-sm p-2">Playlist yok</p>
              ) : (
                playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToPlaylist(playlist.id)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded transition"
                  >
                    {playlist.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}