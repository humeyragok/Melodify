import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { songs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(playlists)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Playlist adı gerekli" }, { status: 400 })
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description: description || null,
        userId: user.id
      }
    })

    return NextResponse.json(playlist)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}