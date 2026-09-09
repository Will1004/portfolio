# Portfolio — Wilfrid Agbassikakou

Portfolio professionnel **statique** (HTML / CSS / JS **vanilla**, sans framework,
sans dépendance externe). Vitrine générale de mon profil **Purple Team** : write-ups
CTF détaillés, projets techniques et outils, compétences et veille — réutilisable pour
tel une candidature, une mise en avant personnelle ou du réseautage.

Thème « terminal / hacker » sobre : anthracite + accent vert, typographie monospace,
responsive, chargement rapide, aucune dépendance au réseau au chargement.

Ligne de vie en ligne : `https://C1PH3R6H05T.github.io/portfolio/`

> ⏫ **Personnalisable pour une offre précise** : le paragraphe « À propos »,
> le badge du hero (`.hero__status`) et l'accent mis sur telle expérience se
> règlent en quelques secondes dans `app.js` (texte du badge/`quote`) et
> `index.html`. Le cœur reste inchangé pour tout usage général.

---

## ⚙️ Structure du dépôt

| Fichier                     | Rôle                                                              |
|-----------------------------|-------------------------------------------------------------------|
| `index.html`                | Structure des sections + SEO (OG, Twitter Card, canonique, JSON-LD Person) |
| `style.css`                 | Thème, badges, bande de stats, veille, contact, responsive        |
| `data.js`                   | **Contenu central à éditer** : write-ups, projets, compétences, veille, contact |
| `app.js`                    | Rendu des cartes, filtres par catégorie, typewriter, nav mobile   |
| `Wilfrid_Agbassikakou_CV.pdf` | CV téléchargeable (bouton « Télécharger mon CV » dans le hero)  |
| `deploy.sh`                 | Assistant de publication GitHub Pages                             |
| `README.md`                 | Ce fichier                                                        |

### Comment modifier le contenu

**Ne touche presque jamais au HTML ni au CSS.** Tout le présentable est dans
`data.js`, sous forme de tableaux/objets faciles à éditer :

- `PROFILE` → nom, tagline, rôles du typewriter, coordonnées, stats, **certifications**.
- `WRITEUPS` → une carte par défi CTF. Chaque carte peut porter
  `methodology` (ou bien `roadmap`, pour un write-up pas à pas métier),
  `tools`, `screenshot`, `lesson`, `category` (web / crypto / stego / ad / osint / soc),
  `platform`, `difficulty`.
- `PROJETS` → titre, objectif, stack (tags), résultat, `link` + `repo` GitHub.
- `COMPETENCES` → groupes de badges.
- `VEILLE` → « ce que j'apprends en ce moment » (encore plus vivant qu'un CV).
- `CONTACT` → dérivé automatiquement de `PROFILE`.

---

## 🧪 Tester en local

```bash
cd ~/Documents/perso/portfolio
python3 -m http.server 8000
# → http://localhost:8000
```

(Lance un vrai petit serveur plutôt que `file://` pour éviter les caches et
bien voir le typewriter / les filtres.)

---

## 🚀 Publier sur GitHub Pages (recommandé)

Ce dépôt est câblé pour **`C1PH3R6H05T/portfolio`** :

1. **Crée le dépôt sur GitHub** : https://github.com/new
   - Owner : choisis ton compte perso **C1PH3R6H05T** (si le pseudo n'existe pas
     encore sur ton compte, renomme le dépôt/le profil d'abord depuis
     *GitHub → Settings → Profile*, ou utilise le pseudo de ton choix).
   - Repository name : **`portfolio`** — Public.
   - **Ne coche PAS** « Add a README / .gitignore » (les fichiers locaux sont déjà prêts).
2. Pousse les fichiers (déjà initialisables en git) :

   ```bash
   cd ~/Documents/perso/portfolio
   chmod +x deploy.sh && ./deploy.sh
   ```
   — ou à la main :
   ```bash
   git init && git add -A && git commit -m "Initial portfolio"
   git remote add origin https://github.com/C1PH3R6H05T/portfolio.git
   git branch -M main
   git push -u origin main
   ```
3. **Active GitHub Pages** : sur le dépôt → *Settings → Pages → Build and deployment
   → Source : Deploy from a branch → Branch `main` + `/ (root)` → Save*.
4. Ça y est, le site est en ligne sur **`https://C1PH3R6H05T.github.io/portfolio/`**.

> La canonique (`<link rel="canonical">`), les balises Open Graph / Twitter et les
> URLs `CONTACT` pointent déjà vers cette adresse. Une fois en ligne, fais un
> test de partage LinkedIn/WhatsApp pour vérifier l'aperçu.

### Woula, pas de compte à son nom ?
Si `C1PH3R6H05T` n'est pas encore rattaché à ton compte GitHub, tu as deux choix :
- **Rattacher le pseudo** d'abord (GitHub → Settings → Public profile), puis re-pousser ;
- Ou, en attendant, **Netlify Drop** sans Git : glisse-dépose le dossier sur
  https://app.netlify.com/drop → tu obtiens une URL temporaire du type
  `https://<hash>.netlify.app/` à partager avec ton dossier. Pense simplement à
  harmoniser les URLs (`data.js`, lien *canonical*) si tu changes de pseudo.

---

## 📎 Autres déploiements possibles

| Plateforme     | Comment                                   |
|----------------|-------------------------------------------|
| **GitHub Pages** | ci-dessus (recommandé, gratuit, auto-CD) |
| **Netlify Drop** | https://app.netlify.com/drop — glisser-déposer, sans Git |
| **Vercel / Cloudflare Pages** | import le dépôt, build = rien, output = le dossier racine |

---

## 🛡️ Charte du contenu

- **100 % vérifiable et présentable** : write-ups alignés sur le CV (stage PAC,
  catégories CTF pratiquées). **Aucun flag**, aucune donnée tierce confidentielle,
  aucun détail d'infrastructure interne.
- Aucune dépendance réseau au chargement (le PDF est en local, le favicon est en SVG inline).
- Sobre, technique, rapide — un recruteur lit le dossier en un coup d'œil.

---

## ✅ Pense-bête avant d'envoyer

- [ ] Le pseudo GitHub `C1PH3R6H05T` existe et le dépôt `portfolio` est public
- [ ] GitHub Pages a servi une fois (URL verte) et le contenu s'affiche
- [ ] Liens LinkedIn / Root Me / HackerLab valides dans `data.js`
- [ ] Bouton *Télécharger mon CV* : vérifie `Wilfrid_Agbassikakou_CV.pdf` à jour
- [ ] Test du partage (aperçu Open Graph sur LinkedIn/WhatsApp)
