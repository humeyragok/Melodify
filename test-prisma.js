const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const artists = await prisma.artist.findMany()
  const songs = await prisma.song.findMany()
  
  console.log('Artists:', artists.length)
  console.log('Songs:', songs.length)
}

main().catch(console.error).finally(() => prisma.$disconnect())