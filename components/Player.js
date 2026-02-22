'use client'

import { useEffect, useRef, useState } from 'react'
import usePlayerStore from '@/store/usePlayerStore'

export default function Player() {
  const {
    currentSong,
    isPlaying,
    volume,
    togglePlay,
    setVolume,
    playNext,
    playPrev
  } = usePlayerStore()

  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audioUrl
      audioRef.current.play().catch(err => console.log('Play:', err.name))
    }
  }, [currentSong])

  useEffect(() => {
    if (currentSong) {
      fetch(`/api/liked/check?songId=${currentSong.id}`)
        .then(res => res.json())
        .then(data => setLiked(data.liked))
        .catch(console.error)
    }
  }, [currentSong])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Play:', err.name))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedData = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
  }

  const handleLike = async () => {
    if (!currentSong) return
    try {
      const res = await fetch('/api/liked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: currentSong.id })
      })
      const data = await res.json()
      setLiked(data.liked)
    } catch (error) {
      console.error(error)
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3 z-50">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={playNext}
      />

      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 w-72">
          <div className="w-14 h-14 bg-gray-700 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
            {currentSong?.coverImage ? (
              <img
                src={currentSong.coverImage}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">🎵</span>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-white font-semibold truncate">
              {currentSong ? currentSong.title : 'Şarkı Çalmıyor'}
            </p>
            <p className="text-gray-400 text-sm truncate">
              {currentSong ? currentSong.artist?.name : 'Bir şarkı seç'}
            </p>
          </div>
          {currentSong && (
            <button
              onClick={handleLike}
              className={`text-xl flex-shrink-0 transition ${
                liked ? 'text-green-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              {liked ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
          <div className="flex items-center gap-6">
            <button
              onClick={playPrev}
              className="text-gray-400 hover:text-white transition text-xl"
            >
              ⏮️
            </button>

            <button
              onClick={togglePlay}
              className="bg-white text-black hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition text-lg"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            <button
              onClick={playNext}
              className="text-gray-400 hover:text-white transition text-xl"
            >
              ⏭️
            </button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-gray-400 text-xs w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer accent-green-500"
            />
            <span className="text-gray-400 text-xs w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-72 justify-end">
          <span className="text-gray-400 text-sm">
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔊'}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer accent-green-500"
          />
        </div>
      </div>
    </div>
  )
}