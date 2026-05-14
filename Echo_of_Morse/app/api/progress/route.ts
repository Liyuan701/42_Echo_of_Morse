export async function GET() {
  // 临时 mock（以后再接 DB）
  return Response.json({
    completedLessons: 3,
    targetLessons: 5,
    accuracy: 82,
    streak: 4,
  });
}