import { create } from 'zustand'

const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 1,
  queue: [],
  currentIndex: 0,

  setSong: (song, queue = [], index = 0) => {
    set({
      currentSong: song,
      queue: queue,
      currentIndex: index,
      isPlaying: true
    })
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }))
  },

  setVolume: (volume) => {
    set({ volume })
  },

  playNext: () => {
    const { queue, currentIndex } = get()
    if (currentIndex < queue.length - 1) {
      set({
        currentSong: queue[currentIndex + 1],
        currentIndex: currentIndex + 1,
        isPlaying: true
      })
    }
  },

  playPrev: () => {
    const { queue, currentIndex } = get()
    if (currentIndex > 0) {
      set({
        currentSong: queue[currentIndex - 1],
        currentIndex: currentIndex - 1,
        isPlaying: true
      })
    }
  },

  clearPlayer: () => {
    set({
      currentSong: null,
      isPlaying: false,
      queue: [],
      currentIndex: 0
    })
  }
}))

export default usePlayerStore