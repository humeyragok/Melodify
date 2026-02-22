import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      include: {
        artist: true,
        album: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(songs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, audioUrl, coverImage, duration, artistId } = body

    if (!title || !audioUrl || !artistId || !duration) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 })
    }

    const song = await prisma.song.create({
      data: {
        title,
        audioUrl,
        coverImage: coverImage || null,
        duration: parseInt(duration),
        artistId
      },
      include: {
        artist: true
      }
    })

    return NextResponse.json(song)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}