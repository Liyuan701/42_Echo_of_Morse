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

  await prisma.message.deleteMany();         // Message 没有 Cascade，手动删
  await prisma.conversation.deleteMany();    // 再删 Conversation
  await prisma.friendship.deleteMany();      // Friendship 没有 Cascade，手动删
  await prisma.gameInvitation.deleteMany();  // 同上
  await prisma.letter.deleteMany();          // Letter 被 UserLetterProgress 引用
  await prisma.user.deleteMany();            // 最后删 User，Cascade 会处理其余的

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
  }
}
  console.log("Creating conversations and messages...");

  const lifan = map["lifan"];
  const yren = map["yren"];
  const jdu = map["jdu"];

// 对话 1：lifan <-> yren
const [aId, bId] = lifan.id < yren.id
  ? [lifan.id, yren.id]
  : [yren.id, lifan.id];

const conv1 = await prisma.conversation.create({
  data: {
    userAId: aId,
    userBId: bId,
  },
});
await prisma.message.createMany({
  data: [
    {
      conversationId: conv1.id,
      senderId: lifan.id,
      rawText: "Hello in morse",
      translatedText: ".... . .-.. .-.. ---",
      mode: "LANGUAGE_TO_MORSE",
    },
    {
      conversationId: conv1.id,
      senderId: yren.id,
      rawText: "Reply here",
      translatedText: ".-. . .--. .-.. -.--",
      mode: "LANGUAGE_TO_MORSE",
    },
  ],
});
// 对话 2：lifan <-> jdu
const [cId, dId] = lifan.id < jdu.id
  ? [lifan.id, jdu.id]
  : [jdu.id, lifan.id];

await prisma.conversation.create({
  data: {
    userAId: cId,
    userBId: dId,
  },
});
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