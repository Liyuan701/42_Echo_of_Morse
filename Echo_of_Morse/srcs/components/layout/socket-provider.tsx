// SocketProvider — à compléter par Marc
//
// Problème : par défaut, une connexion socket suit le composant.
// Si l'utilisateur navigue entre les pages (chat, learning, profile...),
// chaque page crée une nouvelle connexion et ferme l'ancienne.
// Résultat : le serveur voit des connexions/déconnexions en boucle,
// et le compteur d'utilisateurs en ligne devient inexact.
//
// Solution : ce composant est placé dans layout.tsx (le "plafond" de l'app).
// Il établit UNE SEULE connexion socket dès que l'utilisateur est connecté,
// et la maintient jusqu'à ce qu'il ferme le navigateur.
//
// Ce que lifan a déjà fait :
//   - api/users/status/route.ts     → met à jour isOnline + lastSeen
//   - api/users/cleanup/route.ts    → supprime les utilisateurs fantômes toutes les 30s
//   - online-counter.tsx            → affiche le nombre d'utilisateurs en ligne
//   - ws-server/server.js           → reçoit les ping et appelle les APIs
//
// Ce qu'il reste à faire ici (Marc) :
//   - importer io depuis socket.io-client
//   - récupérer la session avec useSession()
//   - établir la connexion avec { auth: { userId } }
//   - brancher newSocket sur le setInterval ci-dessous
//   - ajouter newSocket.disconnect() dans le return du useEffect
//   - ajouter <SocketProvider /> dans layout.tsx

"use client";

import { useEffect, useState } from "react";
// TODO: import { io, Socket } from "socket.io-client";
// TODO: import { useSession } from "next-auth/react";

export default function SocketProvider() {
  // TODO: use useSession() to get actuel logined session
  // TODO: use useState to save socket instance

  useEffect(() => {
    // TODO: No connexion if no logined user, return
    // TODO: creat socket connexion，pass userId
    //   const newSocket = io("http://localhost:3001", {
    //     auth: { userId: session.user.id }
    //   });
    // TODO: save newSocket to state

    // TODO: clean interval and connexion
    return () => {
      clearInterval(interval);
      // TODO: newSocket.disconnect();
    };
  }, [session]);

  return null;
}
