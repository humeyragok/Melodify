import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        user: true,
        songs: {
          include: {
            song: {
              include: {
                artist: true,
                album: true
              }
            }
          }
        }
      }
    })

    if (!playlist) {
      return NextResponse.json({ error: "Playlist bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(playlist)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 })
  }
}