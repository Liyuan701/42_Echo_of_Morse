#!/bin/sh
set -e

KEYS_FILE=/vault/data/init-keys.txt

# Attend que Vault soit prêt à recevoir des requêtes
echo "[vault-unseal] Attente du démarrage de Vault..."
until vault status -address=http://vault:8200 2>&1 | grep -q "Initialized"; do
  sleep 2
done
echo "[vault-unseal] Vault est prêt"

if [ ! -f "$KEYS_FILE" ]; then
  # Première fois — initialise Vault et sauvegarde les clés sur disque
  echo "[vault-unseal] Première initialisation..."
  vault operator init -address=http://vault:8200 > "$KEYS_FILE"
  echo "[vault-unseal] Clés sauvegardées dans $KEYS_FILE"
else
  echo "[vault-unseal] Vault déjà initialisé — utilisation des clés existantes"
fi

# Descellement avec les 3 premières clés du fichier
UNSEAL_KEY_1=$(grep "Unseal Key 1" "$KEYS_FILE" | awk '{print $NF}')
UNSEAL_KEY_2=$(grep "Unseal Key 2" "$KEYS_FILE" | awk '{print $NF}')
UNSEAL_KEY_3=$(grep "Unseal Key 3" "$KEYS_FILE" | awk '{print $NF}')

vault operator unseal -address=http://vault:8200 "$UNSEAL_KEY_1"
vault operator unseal -address=http://vault:8200 "$UNSEAL_KEY_2"
vault operator unseal -address=http://vault:8200 "$UNSEAL_KEY_3"

echo "[vault-unseal] Vault déscellé avec succès"

# Sauvegarde le root token pour que vault-init puisse le lire
grep "Initial Root Token" "$KEYS_FILE" | awk '{print $NF}' > /vault/data/root-token.txt
echo "[vault-unseal] Root token sauvegardé dans /vault/data/root-token.txt"
