import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@cartcontainer.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existing) {
    console.log("Admin user already exists.");
    return;
  }

  // Create admin user
  await prisma.user.create({
    data: {
      name: "Admin",
      email: adminEmail,
      password: await hash("admin123", 12),
      role: "admin",
    },
  });

  console.log(`Admin created: ${adminEmail} / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
