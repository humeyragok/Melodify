import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params
    const { id, songId } = resolvedParams
    
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })
    }

    await prisma.playlistSong.deleteMany({
      where: {
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