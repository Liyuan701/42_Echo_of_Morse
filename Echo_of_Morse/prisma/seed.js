const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const PASSWORD = "mdp";

const users = [
  { username: "lifan", learningLevel: 3 },
  { username: "yren", learningLevel: 4 },
  { username: "jdu", learningLevel: 2 },
  { username: "mlaurent", learningLevel: 5 },
  { username: "gustav", learningLevel: 3 },
  { username: "nobody", learningLevel: 1 },
];

async function main() {
  console.log("Reset database...");

  await prisma.userLetterProgress.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.letter.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  console.log("Creating users...");

  const created = [];

  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        username: u.username,
        email: `${u.username}@test.com`,
        passwordHash,
        learningLevel: u.learningLevel,
        bio: "",
        isOnline: false,
      },
    });

    created.push(user);
  }

  const map = Object.fromEntries(
    created.map((u) => [u.username, u])
  );

console.log("Creating FULL friendships...");

const group = ["lifan", "yren", "jdu", "mlaurent", "gustav"];

for (let i = 0; i < group.length; i++) {
  for (let j = i + 1; j < group.length; j++) {
    const a = map[group[i]];
    const b = map[group[j]];

    // A -> B
    await prisma.friendship.create({
      data: {
        senderId: a.id,
        receiverId: b.id,
        status: "ACCEPTED",
      },
    });

    // B -> A
    await prisma.friendship.create({
      data: {
        senderId: b.id,
        receiverId: a.id,
        status: "ACCEPTED",
      },
    });
  }
}

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });