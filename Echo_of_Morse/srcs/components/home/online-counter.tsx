// // calls the API online-count

// import { unstable_noStore as noStore } from "next/cache";

// import { Card } from "@/components/ui";
// import styles from "./home.module.css";

// export default async function OnlineCounter() {
//   noStore();

//   let onlineCount = 0;


// //lifan: use API to get online num.
//   try {
//     const res = await fetch("http://web:3000/api/users/online-count", {
//       cache: "no-store",
//     });

//     const data = await res.json();
//     onlineCount = data.count ?? 0;
//   } catch {
//     onlineCount = 0;
//   }

//   // try {
//   //   // ! yren: replace this temporary query with the real online user count
//   //   // ! after auth / session / user online status is confirmed.
//   //   const [{ count }] = await prisma.$queryRaw<Array<{ count: bigint }>>`
//   //     SELECT COUNT(DISTINCT "userId") AS count
//   //     FROM "Progress"
//   //   `;
//   //   onlineCount = Number(count);
//   // } catch {
//   //   onlineCount = 0;
//   // }

//   return (
//     <Card className={styles.sectionBlock}>
//       <h2 className={styles.sectionTitle}>Online now</h2>

//       {/* ! yren: display the real number of online users here */}
//       <p className={styles.onlineText}>{onlineCount} users connected</p>
//     </Card>
//   );
// }

// // ! i18n: move home page titles, descriptive paragraphs, online-user labels, empty states, buttons, and alert messages into the i18n dictionary.
// // ! i18n: keep dynamic values such as onlineCount and displayName as interpolation variables.



//----------------------------------------------------------------------------------------------------------------------------------------------



// "use client";

// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// import { Card } from "@/components/ui";
// import styles from "./home.module.css";

// export default function OnlineCounter() {
//   const [onlineCount, setOnlineCount] = useState(0);

//   useEffect(() => {
//     const socket = io("http://localhost:3001", {
//       transports: ["websocket"],
//     });

//     socket.on("connect", () => {
//       console.log("✅ Connected:", socket.id);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Connection error:", err);
//     });

//     socket.on("users-count", (count) => {
//       console.log("📩 Count received:", count);
//       setOnlineCount(count);
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Disconnected");
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <Card className={styles.sectionBlock}>
//       <h2 className={styles.sectionTitle}>Online now</h2>

//       <p className={styles.onlineText}>
//         {onlineCount} users connected
//       </p>
//     </Card>
//   );
// }


//-------------------------------

"use client";

import { useEffect, useState } from "react";

import { useSocket } from "@/providers/socket-provider";
import styles from "./home.module.css";
import { Card } from "@/components/ui";

export default function OnlineCounter() {
  const { socket, isConnected } = useSocket();

  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    console.log("ONLINE COUNTER SOCKET:", socket);

    const handleUsersCount = (count: number) => {
      console.log("RECEIVED users-count:", count);
      setOnlineCount(count);
    };

    socket.on("users-count", handleUsersCount);

    if (socket.connected) {
      socket.emit("get-users-count");
    }

    return () => {
      socket.off("users-count", handleUsersCount);
    };
  }, [socket]);

  return (
  <Card className={styles.sectionBlock}>
    <h2 className={styles.sectionTitle}>Online now</h2>

    <p className={styles.onlineText}>
      {onlineCount} users connected
    </p>
  </Card>
  );
}

// ! i18n: move home page titles, descriptive paragraphs, online-user labels, empty states, buttons, and alert messages into the i18n dictionary.
// ! i18n: keep dynamic values such as onlineCount and displayName as interpolation variables.
//? yren to jdu:
//? TODO_i18n: This component is server-side, so it cannot use useI18n directly.
//? Ask the owner whether to pass translated labels as props or convert it to a client component.
