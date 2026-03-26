import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/** Maps legacy sslmode values to explicit `verify-full` (matches pg v8 behavior; silences pg-connection-string v3 prep warning). */
function normalizePostgresUrl(connectionString: string): string {
  try {
    const url = new URL(connectionString)
    const mode = url.searchParams.get('sslmode')
    if (
      mode &&
      (mode === 'prefer' || mode === 'require' || mode === 'verify-ca')
    ) {
      url.searchParams.set('sslmode', 'verify-full')
      return url.toString()
    }
  } catch {
    // non-URL connection strings — pass through
  }
  return connectionString
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL
  if (!raw) {
    throw new Error(
      'DATABASE_URL is not set. Add it to your environment for Prisma to connect.'
    )
  }

  const connectionString = normalizePostgresUrl(raw)
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
