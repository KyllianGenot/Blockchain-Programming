#!/bin/bash

FRONTEND_DIR="frontend"
ENV_FILE=".env"
DEPLOY_OUTPUT="deploy_output.json"
FILTERED_OUTPUT="filtered_output.json"

# Vérifier que le fichier .env existe
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Erreur : Le fichier .env n'existe pas. Créez-le avec RPC_URL et PRIVATE_KEY."
  exit 1
fi

# Charger les variables d'environnement
export $(grep -v '^#' $ENV_FILE | xargs)
source .env

# Nettoyer et compiler
forge clean
forge build

# Étape 1 : Déploiement des contrats
echo "🚀 Déploiement des contrats avec Foundry..."
forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast