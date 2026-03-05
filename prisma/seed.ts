import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  const adminName = process.env.ADMIN_NAME ?? "biruk";
  const adminEmail = process.env.ADMIN_EMAIL ?? "biruk19@gmail.com";
  const adminPlainPassword = process.env.ADMIN_PASSWORD ?? "pass3685";

  const adminPassword = await bcrypt.hash(adminPlainPassword, 12);
  const userPassword = await bcrypt.hash("user12345", 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: adminPassword,
      role: "ADMIN",
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@gamehub.dev" },
    update: {},
    create: {
      name: "User",
      email: "user@gamehub.dev",
      password: userPassword,
      role: "USER",
    },
  });

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
