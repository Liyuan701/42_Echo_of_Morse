"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { encode } from "@/lib/morse";
import { playMorse } from "@/lib/audio";
import styles from "./MorsePlayer.module.css";

export default function MorsePlayer() {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const morse = useMemo(() => {
    return text.trim() ? encode(text) : "";
  }, [text]);

  async function handlePlay() {
    if (!text.trim()) {
      return;
    }

    try {
      setIsPlaying(true);
      await playMorse(morse);
    } finally {
      setIsPlaying(false);
    }
  }

  const isDisabled = !text.trim() || isPlaying;

  return (
    <section className={styles.panel}>
      <div className={styles.content}>
        <label className={styles.field}>
          <span className={styles.label}>Input Message</span>

          <input
            className={styles.input}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter text"
          />
        </label>

        <div>
          <p className={styles.label}>Encoded Morse</p>

          <div className={styles.output}>
            {morse || "No transmission yet."}
          </div>
        </div>

        <Button
          type="button"
          onClick={handlePlay}
          disabled={isDisabled}
          className={styles.playButton}
        >
          {isPlaying ? "Transmitting..." : "Play Morse"}
        </Button>
      </div>
    </section>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { encode } from "@/lib/morse";
// import { playMorse } from "@/lib/audio";

// let socket: Socket;

//   async function handlePlay(text: string) 
//   {
//     const morse = encode(text);
//     await playMorse(morse);
//     socket.emit("send-morse", morse);
//   }

// export default function MorsePlayer() 
// {
//   const [text, setText] = useState("");

//   useEffect(() => {
//     socket = io("http://localhost:3001");

//     const handler = async (morse: string) => {
//       console.log("Received:", morse);
//       await playMorse(morse);
//     };

//     socket.on("receive-morse", handler);

//     return () => {
//       socket.off("receive-morse", handler);
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <input
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Enter text"
//       />
//       <button onClick={() => handlePlay(text)}>Play</button>
//     </div>
//   );
// }