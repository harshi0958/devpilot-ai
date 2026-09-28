import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

declare const process: {
  exit(code?: number): never;
};

const prisma = new PrismaClient();

async function main() {
  const email = "harshitjariwala0104@gmail.com";
  const newPassword = "DevPilot@2026";

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  console.log("Password reset successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });