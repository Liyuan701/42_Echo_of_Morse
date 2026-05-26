// calls the API online-count

import { unstable_noStore as noStore } from "next/cache";

import { Card } from "@/components/ui";
import styles from "./home.module.css";

export default async function OnlineCounter() {
  noStore();

  let onlineCount = 0;


//lifan: use API to get online num.
  try {
    const res = await fetch("http://web:3000/api/users/online-count", {
      cache: "no-store",
    });

    const data = await res.json();
    onlineCount = data.count ?? 0;
  } catch {
    onlineCount = 0;
  }

  // try {
  //   // ! yren: replace this temporary query with the real online user count
  //   // ! after auth / session / user online status is confirmed.
  //   const [{ count }] = await prisma.$queryRaw<Array<{ count: bigint }>>`
  //     SELECT COUNT(DISTINCT "userId") AS count
  //     FROM "Progress"
  //   `;
  //   onlineCount = Number(count);
  // } catch {
  //   onlineCount = 0;
  // }

  return (
    <Card className={styles.sectionBlock}>
      <h2 className={styles.sectionTitle}>Online now</h2>

      {/* ! yren: display the real number of online users here */}
      <p className={styles.onlineText}>{onlineCount} users connected</p>
    </Card>
  );
}

// ! i18n: move home page titles, descriptive paragraphs, online-user labels, empty states, buttons, and alert messages into the i18n dictionary.
// ! i18n: keep dynamic values such as onlineCount and displayName as interpolation variables.
//? yren to jdu:
//? TODO_i18n: This component is server-side, so it cannot use useI18n directly.
//? Ask the owner whether to pass translated labels as props or convert it to a client component.