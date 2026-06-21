import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("yunwu2026", 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@yunwuorigin.com" },
    update: { passwordHash: hash },
    create: {
      email: "admin@yunwuorigin.com",
      passwordHash: hash,
      name: "允物管理员",
      role: "SUPER_ADMIN",
    },
  });

  console.log("Admin user created:", admin.email, admin.role);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
