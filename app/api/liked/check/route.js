import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ liked: false })
    }

    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const liked = await prisma.likedSong.findUnique({
      where: {
        userId_songId: {
          userId: user.id,
          songId: songId
        }
      }
    })

    return NextResponse.json({ liked: !!liked })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ liked: false })
  }
}