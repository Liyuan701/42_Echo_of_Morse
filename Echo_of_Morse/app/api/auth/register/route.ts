// NextRequest = la requête http apres next
// NextResponse = la réponse http apres next
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {

	//1. obtenir les donnes
    const { username, email, password, confirmPassword } = await req.json();

	//2. verifie si email ou password est manquant
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
	if (!username) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

	//3. le mot de passe contient moins de 8 caractères
	if (password !== confirmPassword) {
		return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
	}

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

	//4. cherche dans la table user s’il existe déjà un utilisateur avec le même email, sinon existing = null
	const existingUsername = await prisma.user.findUnique({
		where: { username },
		});
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing || existingUsername) {
      return NextResponse.json({ error: "Username or email already in use" }, { status: 409 });
    }

	//5. on crée un nouvel utilisateur dans la base de données et proteger aevc hased
	const hashed = await bcrypt.hash(password, 12);
	const user = await prisma.user.create({data: { username: username, email: email, passwordHash: hashed,},});

    return NextResponse.json({ id: user.id, email: user.email, username: user.username }, { status: 201 });
  } 
  catch (e) 
  {
	// affiche l’erreur dans la console du serveur
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
