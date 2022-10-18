import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const t0 = +new Date()

  const result = (await prisma.historyStatistics.findFirst())!
  /* const result = await prisma.lastHistoryScrapedId.deleteMany()
  await prisma.historyAuction.deleteMany()
  await prisma.unfinishedAuction.deleteMany() */
  const t1 = +new Date()
  console.log(JSON.parse(result.jsonData))
  console.log(`took: ${t1 - t0}ms`)
}

main()
