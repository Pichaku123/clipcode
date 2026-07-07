import 'dotenv/config';
import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'dev@local.test' },
    update: {},
    create: { id: 'dev-user-1', email: 'dev@local.test', passwordHash: 'unused-until-real-auth' },
  });
  console.log('Seeded dev user:', user.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());