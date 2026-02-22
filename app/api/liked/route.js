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

    const likedSongs = await prisma.likedSong.findMany({
      where: { userId: user.id },
      include: {
        song: {
          include: {
            artist: true,
            album: true
          }
        }
      },
      orderBy: { likedAt: 'desc' }
    })

    return NextResponse.json(likedSongs)
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

    const { songId } = await request.json()

    const existing = await prisma.likedSong.findUnique({
      where: {
        userId_songId: {
          userId: user.id,
          songId: songId
        }
      }
    })

    if (existing) {
      await prisma.likedSong.delete({
        where: { id: existing.id }
      })
      return NextResponse.json({ liked: false })
    } else {
      await prisma.likedSong.create({
        data: {
          userId: user.id,
          songId: songId
        }
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}