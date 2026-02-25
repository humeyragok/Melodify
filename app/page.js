'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home')
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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Melodify</h1>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login"
            className="text-white hover:text-green-500 font-semibold px-4 py-2"
          >
            Giriş Yap
          </Link>
          <Link 
            href="/register"
            className="bg-white text-black hover:bg-gray-200 font-semibold px-6 py-2 rounded-full"
          >
            Kayıt Ol
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-6">
            Müziğin
            <span className="text-green-500"> Gücünü</span>
            <br />
            Hisset
          </h2>
          <p className="text-gray-400 text-xl mb-12">
            Milyonlarca şarkı, podcast ve playlist. Ücretsiz kaydol ve keşfetmeye başla.
          </p>
          <Link 
            href="/register"
            className="inline-block bg-green-500 text-black hover:bg-green-400 font-bold px-12 py-4 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Ücretsiz Başla
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="text-center p-8 bg-gray-900 rounded-lg">
            <div className="text-5xl mb-4">🎧</div>
            <h3 className="text-white text-2xl font-bold mb-3">
              Sınırsız Müzik
            </h3>
            <p className="text-gray-400">
              Favori şarkılarını dinle, yeni müzikler keşfet
            </p>
          </div>
          <div className="text-center p-8 bg-gray-900 rounded-lg">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-white text-2xl font-bold mb-3">
              Her Yerde Dinle
            </h3>
            <p className="text-gray-400">
              Telefon, tablet, bilgisayar - istediğin yerden
            </p>
          </div>
          <div className="text-center p-8 bg-gray-900 rounded-lg">
            <div className="text-5xl mb-4">🎵</div>
            <h3 className="text-white text-2xl font-bold mb-3">
              Kendi Playlistin
            </h3>
            <p className="text-gray-400">
              Playlist oluştur, arkadaşlarınla paylaş
            </p>
          </div>
        </div>

        <div className="mt-32">
          <h3 className="text-white text-3xl font-bold mb-8">
            Popüler Türler
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Elektronik', 'Klasik', 'R&B', 'Blues'].map((genre) => (
              <div 
                key={genre}
                className="bg-gradient-to-br from-green-500 to-green-700 p-8 rounded-lg hover:scale-105 transition-transform cursor-pointer"
              >
                <h4 className="text-white text-xl font-bold">{genre}</h4>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-32 py-12">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; 2024 Melodify. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}