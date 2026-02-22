import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(artists)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, image, bio } = body

    if (!name) {
      return NextResponse.json({ error: "Sanatçı adı gerekli" }, { status: 400 })
    }

    const artist = await prisma.artist.create({
      data: { name, image: image || null, bio: bio || null }
    })

    return NextResponse.json(artist)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}