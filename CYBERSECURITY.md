# Module Cybersécurité — WAF + HashiCorp Vault

**Responsable : Gustavo**
**Points : 2 (module majeur)**

Ce module ajoute deux couches de sécurité au projet :
1. **WAF (ModSecurity + OWASP CRS)** — filtre tout le trafic entrant et bloque les attaques
2. **HashiCorp Vault** — gère tous les secrets de l'application (mots de passe, clés API, tokens)

---

## Architecture globale

```
Internet
   ↓
waf:443  (ModSecurity — seul service exposé)
   ↓ filtre SQLi, XSS, Path Traversal, Command Injection
web:3000  (Next.js)
   ↓ lit les secrets au démarrage
vault:8200  (HashiCorp Vault)
   ↓
db:5432  (PostgreSQL)
```

---

## 1. WAF — ModSecurity + OWASP CRS

### Ce que ça fait

Le WAF est le **seul service avec des ports exposés** (80 et 443). Tout le trafic passe par lui avant d'atteindre l'application. Il bloque automatiquement :

| Attaque | Exemple bloqué |
|---|---|
| SQL Injection | `?id=1' OR '1'='1` |
| XSS | `?q=<script>alert(1)</script>` |
| Path Traversal | `?file=../../etc/passwd` |
| Command Injection | `?cmd=;ls -la` |

Une requête bloquée reçoit une réponse **403 Forbidden**.

### Configuration active

```
MODSEC_RULE_ENGINE=On   → bloque (ne pas changer en DetectionOnly)
PARANOIA=1              → niveau de sensibilité standard
ANOMALY_INBOUND=5       → score max avant blocage (trafic entrant)
ANOMALY_OUTBOUND=4      → score max avant blocage (trafic sortant)
```

### Tester le WAF

```bash
# Requête normale — doit retourner 200
curl -k https://localhost/api/health

# SQL Injection — doit retourner 403
curl -k "https://localhost/?id=1%27%20OR%20%271%27%3D%271"

# XSS — doit retourner 403
curl -k "https://localhost/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E"

# Path Traversal — doit retourner 403
curl -k "https://localhost/?file=../../etc/passwd"
```

### Voir les logs WAF en temps réel

```bash
docker logs transcendence_waf -f
```

---

## 2. HashiCorp Vault — Gestion des secrets

### Comment ça fonctionne

Au démarrage du serveur Next.js, `instrumentation.js` lit automatiquement tous les secrets depuis Vault et les injecte dans `process.env`. Vous n'avez rien à faire — utilisez `process.env` comme d'habitude.

```
vault → vault-unseal → vault-init → web (Next.js)
                                       ↓
                              instrumentation.js lit les secrets
                              → injecte dans process.env
                              → Prisma et NextAuth fonctionnent normalement
```

### Secrets disponibles dans process.env

Après le démarrage, ces variables sont accessibles partout dans le code :

```
process.env.DATABASE_URL           // connexion PostgreSQL
process.env.NEXTAUTH_SECRET        // clé de signature JWT
process.env.NEXTAUTH_URL           // URL de l'application
process.env.GITHUB_CLIENT_ID
process.env.GITHUB_CLIENT_SECRET
process.env.GOOGLE_CLIENT_ID
process.env.GOOGLE_CLIENT_SECRET
process.env.FORTYTWO_CLIENT_ID
process.env.FORTYTWO_CLIENT_SECRET
```

### Exemple — API route

```ts
// app/api/exemple/route.ts
export async function GET() {
  // DATABASE_URL est déjà injecté par instrumentation.js
  // Prisma l'utilise automatiquement — rien à faire
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
```

### Exemple — auth.ts

```ts
// srcs/lib/auth.ts
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // injecté automatiquement par instrumentation.js
};
```

### Ajouter un nouveau secret

Si votre module nécessite une nouvelle variable secrète, **contactez Gustavo** en lui indiquant :
- Le nom de la variable (ex: `MA_NOUVELLE_CLE`)
- À quoi elle sert

**Gustavo s'occupe de tout :**
1. Intègre la variable dans Vault (`docker-compose.yml` + `instrumentation.js`)
2. Pousse les changements sur `main`
3. Vous faites `git pull origin main` sur votre branche

```bash
git pull origin main
```

Après ça, `process.env.MA_NOUVELLE_CLE` est disponible partout dans le code.

---

## Ne pas faire

```js
// Ne jamais appeler vaultClient.js directement dans vos composants ou API routes
const { getSecret } = require('../../srcs/lib/vaultClient.js');
// inutile — instrumentation.js le fait déjà au démarrage
```

```ts
// Ne jamais hardcoder des secrets
const password = "monMotDePasse"; // interdit
```

---

## En développement (docker-compose.dev.yml)

Vault n'est pas actif avec le compose dev. `instrumentation.js` détecte l'absence de `VAULT_ADDR` et laisse Next.js démarrer normalement en utilisant les variables du `.env` directement. Aucune action requise de votre part.
