import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })
    }

    const { songId } = await request.json()

    const existing = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: id,
          songId: songId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ error: "Şarkı zaten playlistte" }, { status: 400 })
    }

    await prisma.playlistSong.create({
      data: {
        playlistId: id,
        songId: songId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}