import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ songs: [], artists: [] })
    }

    const songs = await prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { artist: { name: { contains: query, mode: 'insensitive' } } }
        ]
      },
      include: {
        artist: true,
        album: true
      },
      take: 20
    })

    const artists = await prisma.artist.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 10
    })

    return NextResponse.json({ songs, artists })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}