#!/usr/bin/env bash
# ============================================================
# deploy.sh — publie le portfolio sur GitHub Pages (C1PH3R6H05T/portfolio)
#
# Prérequis :
#   1. Le pseudo GitHub C1PH3R6H05T existe sur ton compte (ou adapte le OWNER ci-dessous)
#   2. Un dépôt PUBLIC nommé "portfolio" a été créé sur github.com/new
#      (de préférence SANS README/.gitignore générés automatiquement)
#   3. gh CLI connecté OU tu as tes identifiants / clé SSH (voir DEPLOY_VIA)
#
# Usage :  chmod +x deploy.sh && ./deploy.sh
# ============================================================
set -euo pipefail

OWNER="${1:-C1PH3R6H05T}"      # ← ton pseudo GitHub perso
REPO="portfolio"
REMOTE="origin"
BRANCH="main"

# 1 — cohérence du dossier (on est dans le dépôt du portfolio)
if [[ ! -f index.html || ! -f app.js || ! -f data.js ]]; then
  echo "💥 Tu dois lancer ce script depuis le dossier du portfolio (celui qui contient index.html)."
  exit 1
fi

# 2 — git infos locales
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "→ git init"
  git init -q
fi
git branch -M "$BRANCH"

# 3 — chaque push un commit propre, data cachée du cache envoyée quand même
git add -A
if git diff --cached --quiet; then
  echo "ℹ️  Rien à committer (déjà à jour)."
else
  git commit -q -m "Portfolio — mise à jour" || true
fi

# 4 — remote
if ! git remote | grep -q "^$REMOTE$"; then
  git remote add "$REMOTE" "https://github.com/$OWNER/$REPO.git"
fi

# 5 — push (essaie HTTPS, puis token gh, puis réessaie avec le login courant)
echo "→ Push sur github.com/$OWNER/$REPO ($BRANCH) …"
if git push -u "$REMOTE" "$BRANCH" 2>/tmp/deploy.err; then
  :
elif command -v gh >/dev/null 2>&1 && git remote set-url "$REMOTE" "https://github.com/$OWNER/$REPO.git" &&
     gh repo set-default "$OWNER/$REPO" >/dev/null 2>&1 && git push -u "$REMOTE" "$BRANCH" 2>/tmp/deploy2.err; then
  :
else
  cat /tmp/deploy.err /tmp/deploy2.err 2>/dev/null || true
  echo ""
  echo "🚫 Le push HTTPS a échoué. Deux causes typiques :"
  echo "   1) le dépôt $OWNER/$REPO n'existe pas encore, OU"
  echo "      → crée-le :  https://github.com/new  (Nom : $REPO, Public)"
  echo "   2) pas d'authentification HTTPS configurée."
  echo "      → soit connecte-toi à GitHub dans gh :  gh auth login"
  echo "      → soit utilise ta clé SSH (déjà sur GitHub) :"
  echo "        git remote set-url $REMOTE git@github.com:$OWNER/$REPO.git && git push -u $REMOTE $BRANCH"
  exit 1
fi

echo ""
echo "✅ Poussé sur https://github.com/$OWNER/$REPO"
echo "   SITE (une fois GitHub Pages activé, Settings→Pages) :"
echo "   https://$OWNER.github.io/$REPO/"
echo ""
echo "   Si Pages n'est pas encore actif, active-le depuis l'onglet Settings → Pages"
echo "   (Source : Deploy from a branch → main + / (root))."
