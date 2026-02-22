import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const limit = body.limit || 20

    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.JAMENDO_CLIENT_ID}&format=json&limit=${limit}&include=musicinfo&groupby=artist_id`
    )

    const data = await response.json()

    let addedArtists = 0
    let addedSongs = 0
    let skipped = 0

    for (const track of data.results) {
      // Sanatçıyı bul veya oluştur
      let artist = await prisma.artist.findFirst({
        where: { name: track.artist_name }
      })

      if (!artist) {
        artist = await prisma.artist.create({
          data: {
            name: track.artist_name,
            image: track.artist_image || null
          }
        })
        addedArtists++
      }

      // Şarkı zaten var mı kontrol et
      const existingSong = await prisma.song.findFirst({
        where: { 
          title: track.name, 
          artistId: artist.id 
        }
      })

      if (!existingSong) {
        await prisma.song.create({
          data: {
            title: track.name,
            audioUrl: track.audio,
            coverImage: track.image || null,
            duration: track.duration,
            artistId: artist.id
          }
        })
        addedSongs++
      } else {
        skipped++
      }
    }

    return NextResponse.json({
      success: true,
      addedSongs,
      addedArtists,
      skipped
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}