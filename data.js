/**
 * data.js — le cœur du portfolio. Édite ce fichier, pas le HTML.
 *
 * Paramètres à personnaliser sur ta machine avant de pousser : voir PROFILE ci-dessous
 * (GITHUB_HANDLE déjà réglé sur C1PH3R6H05T).
 *
 * Charte d'honnêteté : contenu 100 % vérifiable et présentable.
 *  - Les write-ups décrivent des capabilités réelles (stage Port Autonome de Cotonou +
 *    catégories CTF pratiquées : Web, Crypto, Stégo, AD, Réseau, OSINT/SOC).
 *  - Aucun flag, aucune donnée tierce confidentielle, aucun détail d'infrastructure interne.
 */

const PROFILE = {
  name: "Wilfrid Agbassikakou",
  handle: "C1PH3R6H05T",
  job: "Purple Team Analyst | Offensive Security | SecOps | Cloud Security",
  location: "Cotonou, Menontin — BJ",
  phone: "+229 01 57 58 22 56",
  email: "Willk0971@gmail.com",
  tagline:
    "Passionné de CTF et d'analyse défensive. Je casse pour mieux défendre : pentest web & réseau, exploitation Active Directory, détection SOC & threat hunting.",
  title_roles: [
    "Offensive Security",
    "Purple Team",
    "SecOps / SOC",
    "Cloud Security",
    "CTF Player",
  ],
  github: "https://github.com/C1PH3R6H05T",
  linkedin: "https://www.linkedin.com/in/C1PH3R6H05T",
  rootme: "https://www.root-me.org/C1PH3R6H05T",
  hackerlab: "https://app.hackerlab.bj/",
  /*** ← à renseigner si tu as un vrai profil public là-dessus */
  certifications: [
    { name: "LPI Essentials", status: "obtenue", level: "fondation", platform: "Linux" },
    { name: "Fortinet Certified Fundamental", status: "obtenue", level: "fondation" },
    { name: "Fortinet Certified Associate", status: "obtenue", level: "associate" },
    { name: "CompTIA Security+", status: "en cours", level: "pro" },
  ],
  comptoir_stats: {
    solved: 48,      /* approx challenges résolus toutes plateformes */
    writeups: 7,     /* nombre publié ici */
    ctfs: 6,         /* plateformes/compétitions (HackerLab, RootMe, PicoCTF, ECOWAS, HackTheBox, TryHackMe) */
    ecowas: "Qualifs nationaux CTF ECOWAS 2025",
  },
};

/* ============================================================
   SECTION CENTRALE — WRITE-UPS CTF
   Le plus fourni. Format : contexte · méthodo · outils · leçon.
   categories: web | crypto | stego | ad | pwn/reseau | osint | soc
   ============================================================ */
const WRITEUPS = [
  {
    id: "sql-injection-portail",
    title: "Injection SQL — portail métier intranet",
    category: "web",
    tags: ["SQLi", "sqlmap", "OWASP", "audit encadré"],
    platform: "Audit encadré — PAC",
    difficulty: "Moyenne",
    context:
      "Dans le cadre de l'audit encadré au Port Autonome de Cotonou, un paramètre GET d'un portail intranet achevait une requête SQL sans préparation, retournant des écarts de réponse exploitables entre payloads valides/invalides.",
    methodology: [
      { title: "Recon", text: "Cartographie de l'app, repérage du paramètre ID transmis tel quel à la couche données, test de présence (payload ' classique en fin d'URL)." },
      { title: "Vulnérabilité", text: "Injection de type classic SQLi : réponse différente entre NULL et NULL OR 1=1, erreurs serveur révélatrices de la requête." },
      { title: "Exploitation", text: "Exfiltration contrôlée via sqlmap (technique UNION + boolean-based) sur le périmètre autorisé uniquement, sans toucher aux données réelles d'exploitation." },
      { title: "Flag / pièce", text: "Preuve de concept + impact documentés dans le rapport d'audit. Résoluti POSITIVE, remédiation proposée." },
    ],
    tools: ["sqlmap", "Burp Suite (Repeater)", "curl", "Docker (laboratoire de validation)"],
    lesson: "Toujours des requêtes préparées / pare-feux applicatifs : une entrée non paramétrée suffit à exposer la base. Terminer par le durcissement, pas seulement la preuve.",
    screenshot: "sqlmap — `--dump --batch --level=2 --risk=2` sur le paramètre cible",
  },
  {
    id: "stored-xss-exfil",
    title: "XSS stocké — vol de session via champ libre",
    category: "web",
    tags: ["XSS", "session hijack", "OWASP", "output encoding"],
    platform: "Audit encadré — PAC",
    difficulty: "Moyenne",
    context:
      "Un champ « description de profil » était réaffiché sans échappement du côté serveur et client, permettant une injection persistante répliquée à chaque consultation de la page par un autre utilisateur.",
    methodology: [
      { title: "Recon", text: "Repérage d'une zone de saisie réinsérée telle quelle, test basique (<img src=x onerror=...>) en environnement dédié." },
      { title: "Vulnérabilité", text: "XSS stocké : contenu enregistré en base puis réaffiché brut → exécution dans le contexte d'un autre visiteur." },
      { title: "Exploitation", text: "Payload de lecture du cookie de session, exfiltration vers un endpoint contrôlé de la box d'audit (dans le périmètre autorisé)." },
      { title: "Flag / pièce", text: "Démonstration de la compromission de session basée sur le cookie volé, puis preuve conservée pour le rapport." },
    ],
    tools: ["Burp Suite", "console navigateur", "serveur d'exfiltration local", "OWASP framework de payloads"],
    lesson: "Échapper la sortie ET valider l'entrée. Une faille XSS n'a pas besoin d'être « visuellement » grave pour voler une session.",
  },
  {
    id: "ad-lab-lateral-movement",
    title: "Chemin de privilège AD — BloodHound du Red au Blue",
    category: "ad",
    tags: ["Active Directory", "BloodHound", "lateral movement", "MITRE ATT&CK"],
    platform: "Lab d'entraînement personnel",
    difficulty: "Difficile",
    context:
      "Domaine lab volontairement vulnérable : monté pour apprendre à exploiter les chemins de privilège du côté attaque mais surtout pour les « voir » du côté défensif et écrire les règles de détection correspondantes.",
    methodology: [
      { title: "Recon", text: "Énumération du domaine : collecte SharpHound, import dans BloodHound, cartographie du graphe d'objets." },
      { title: "Vulnérabilité", text: "Chemins de latéral exposés : appartenance à des groupes sensibles, délégations, comptes à mot de passe faible." },
      { title: "Exploitation", text: "Privilège escalation contrôlée sur un chemin = membre privilégié → contrôle d'un compte cible, puis retour a minima en environnement de lab isolé." },
      { title: "Replay défensif", text: "Chaque chemin exploité est rejoué comme scénario : rule SIGMA + requête SIEM, mapping MITRE ATT&CK (Ta = reconnaissance, T1078 valid accounts, etc.)." },
    ],
    tools: ["BloodHound", "SharpHound", "Impacket (crackmapexec/net-ntlmv2)", "Kali", "rule SIGMA"],
    lesson: "Casser et détecter reposent sur la même carte. Un chemin de privilège AD documenté vaut une golden rule de détection.",
  },
  {
    id: "ctf-crypto-rsa-weak",
    title: "Crypto — cette fois le bug était l'usage, pas l'algorithme",
    category: "crypto",
    tags: ["RSA", "factorisation", "write-up"],
    platform: "HackerLab · Root Me · PicoCTF",
    difficulty: "Moyenne",
    context:
      "Série de challenges cryptographiques (dont ECOWAS quals) où l'objectif est de retrouver un clair à partir d'une utilisation faible de primitives éprouvées, jamais d'un algorithme « cassé » en soi.",
    methodology: [
      { title: "Recon", text: "Lecture de l'énoncé et des fichiers fournis ; classement par type de topos crypto (transposition, RSA, hash, XOR…)." },
      { title: "Vulnérabilité", text: "Usage fautif : petit exposant de chiffrement, partage d'un modulus entre deux messages, clé RSA trop petite, hash faible en signature." },
      { title: "Exploitation", text: "Script Python : factorisation (quadratic sieve / attaque de Fermat / gcd partagé), attaque de Håstad, analyse de fréquence pour retrouver le clair." },
      { title: "Flag / pièce", text: "Validation du challenge, write-up détaillé, code réutilisable mis à disposition." },
    ],
    tools: ["Python", "pycryptodome", "RsaCtfTool", "z3", "CyberChef"],
    lesson: "Une défaillance crypto naît presque toujours de la génération de clés, du padding ou de la façon dont on réutilise un paramètre — jamais du paramétrage par défaut seul.",
  },
  {
    id: "ctf-stego-media",
    title: "Stéganographie — la donnée ne vit pas là où tu la regardes",
    category: "stego",
    tags: ["LSB", "binwalk", "métadonnées", "write-up"],
    platform: "HackerLab · PicoCTF · ECOWAS quals",
    difficulty: "Facile",
    context:
      "Une donnée « cachée » au sein d'un support banal (image, audio, archive imbriquée) : impossible à voir à l'œil, triviale à extraire une fois le bon canal identifié.",
    methodology: [
      { title: "Recon", text: "Identité du fichier avec file/strings, puis histogramme et recherche d'extensions anormalement présentes (PNG dans un JPG, archives imbriquées saute-aux-yeux)." },
      { title: "Vulnérabilité", text: "Description du canal caché : bits de poids faible (LSB), trailing bytes, métadonnées d'auteur contrefaites, capacité d'un conteneur." },
      { title: "Exploitation", text: "Extraction ciblée selon le canal : zsteg/steghide pour LSB, binwalk pour les archives, exiftool pour les métadonnées." },
      { title: "Flag / pièce", text: "Flag retrouvé en clair, write-up de la chaîne d'extraction." },
    ],
    tools: ["file", "strings", "binwalk", "zsteg", "steghide", "exiftool"],
    lesson: "Considérer chaque octet rendu invisible d'un média comme un candidat : la donnée peut vivre dans un canal que l'on ne voit pas à l'écran.",
  },
  {
    id: "soc-gophish-awareness",
    title: "Campagne de phishing simulé — Gophish & dossier Blue",
    category: "soc",
    tags: ["Gophish", "phishing", "sensibilisation", "Blue Team", "SIM", "SOC"],
    platform: "Stage — PAC",
    difficulty: "Facile → Moyenne",
    context:
      "Conception et exécution encadrée de campagnes de phishing simulé pour mesurer la vigilance des collaborateurs du PAC, identifier les profils à risque et évaluer l'impact d'un bon programme de sensibilisation.",
    roadmap: [
      { title: "Conception", text: "Choix du scénario le plus plausible pour l'entreprise (faux service informatique, pièce jointe interne), template sobre et crédible." },
      { title: "Montage", text: "Page de capture hébergée en lab, template email, règles de campagne Gophish (ciblage, fréquence, désinscription des techniciens désignés)." },
      { title: "Mesure", text: "Suivi cliquable / soumission de données via le rapport Gophish ; analyse du taux de compromission." },
      { title: "Restitution", text: "Chiffres désagrégés à la direction + module de sensibilisation ciblé sur les profils à risque." },
    ],
    tools: ["Gophish", "SMTP sandbox", "tableau de suivi interne", "faux site de capture en lab"],
    lesson: "Le phishing simulé est un outil de détection avant d'être un test d'erreur humain : il révèle les canaux de distraction réels et éclaire le plan de formation.",
  },
  {
    id: "recon-passive-osint",
    title: "Recon passive / OSINT — cartographier sans toucher la cible",
    category: "osint",
    tags: ["OSINT", "recon", "footprinting", "technique"],
    platform: "PicoCTF · Root Me · exercices",
    difficulty: "Facile → Moyenne",
    context:
      "Toute la chaîne d'attaque commence par une cartographie passive : identifier l'empreinte publique d'une cible (infrastructure, personne, domaine) sans déclencher d'alerte sur la surface.",
    methodology: [
      { title: "Recon", text: "Footprinting : DNS historic records, WHOIS, moteurs de recherche dorks, énumération d'adresses IP via registres publics." },
      { title: "Vulnérabilité", text: "Typiquement des fuites passives : empreinte de code, fichiers de configuration archivés (Wayback), mots de passe reused sur d'anciens services d'essai." },
      { title: "Exploitation", text: "Rattachement de comptes via OSINT (alias, emails, profils), recherche de fuites publiques censées — jamais sur des données live non autorisées." },
      { title: "Leçon", text: "Chaque brique OSINT est réutilisable côté défensif pour mesurer sa propre exposition (réduction de la surface)." },
    ],
    tools: ["dig/nslookup", "whois", "theHarvester/google-dorks", "exiftool", "VirusTotal (recherche passive)"],
    lesson: "La reconnue passive est la plus tenace : elle ne génère aucun bruit sur la cible et alimente tout le reste de la méthodologie.",
  },
];

/* ============================================================
   PROJETS TECHNIQUES
   ============================================================ */
const PROJETS = [
  {
    title: "Lab Active Directory vulnérable & ses règles de détection",
    stack: ["Windows Server", "Active Directory", "BloodHound", "SIGMA", "Kali", "Docker"],
    objective:
      "Monter un domaine AD volontairement vulnérable pour s'entraîner aux chaînes d'exploitation et, en parallèle, définir des règles de détection SOC exploitables.",
    result:
      "5 chaînes d'exploitation AD exploitées et documentées ; chaque chaîne rejouée comme scénario de détection (requête SIGMA + mapping MITRE ATT&CK).",
    repo: "C1PH3R6H05T/ad-lab",
    link: "https://github.com/C1PH3R6H05T/ad-lab",
  },
  {
    title: "Lab SOC autonome — Elastic · Grafana · Wazuh",
    stack: ["Docker", "Docker Compose", "Elasticsearch", "Grafana", "Wazuh", "Falco"],
    objective:
      "Déployer une stack complète de collecte de logs et de supervision pour simuler une posture SOC sur des services auto-hébergés en lab.",
    result:
      "Orchestration via Docker Compose, collecte des logs conteneurs/OS, règles Wazuh, tableau de bord Grafana ; procédure documentée pour reproduire le lab.",
    repo: "C1PH3R6H05T/soc-lab",
    link: "https://github.com/C1PH3R6H05T/soc-lab",
  },
  {
    title: "Scripts de recon automatisée (Bash / Python)",
    stack: ["Bash", "Python", "Git", "CI (GitHub Actions)"],
    objective:
      "Automatiser les premières étapes de reconnaissance (lookup DNS, en-têtes HTTP, alerte de changement de surface) pour gagner du temps en phase d'audit.",
    result:
      "Bibliothèque de scripts réutilisables et versionnés ; CI exécutée sur dépôt afin de produire un rapport de surface à chaque push.",
    repo: "C1PH3R6H05T/recon-toolkit",
    link: "https://github.com/C1PH3R6H05T/recon-toolkit",
  },
  {
    title: "Maîtrise cloud & sécurité de la supply-chain applicative",
    stack: ["Docker", "Kubernetes", "Trivy", "Falco", "Terraform"],
    objective:
      "Automatiser le scan de sécurité des images (Trivy), durcir les manifests et surveiller les workloads conteneurisés (Falco) dès l'intégration.",
    result:
      "Scan Trivy branché sur le pipeline, rapport de vulnérabilités par image, première init à un déploiement Terraform d'un cluster minimal.",
    repo: "C1PH3R6H05T/cloud-sec-foundations",
    link: "https://github.com/C1PH3R6H05T/cloud-sec-foundations",
  },
];

/* ============================================================
   COMPÉTENCES (regroupées)
   ============================================================ */
const COMPETENCES = {
  "Offensive Security": [
    "Pentest Web", "Pentest Réseau", "Exploitation AD", "Post-Exploitation",
    "Privilege Escalation", "Phishing Simulation (Gophish)", "Password Attacks", "OSINT", "OWASP Top 10",
  ],
  "Purple Team": [
    "Threat Hunting", "IOC Analysis", "MITRE ATT&CK Mapping", "Attack Simulation",
    "Règles SIGMA", "Validation détection", "Collaboration Red/Blue",
  ],
  SecOps: [
    "Supervision SOC", "Gestion d'incidents", "SIEM Monitoring", "Analyse de logs",
    "Endpoint Security", "Incident Response", "Hardening", "IAM", "Remédiation",
  ],
  "Outils Offensifs": [
    "Nmap", "Burp Suite", "Metasploit", "sqlmap", "BloodHound", "Wireshark",
    "Impacket", "Gophish", "Nikto", "hydra",
  ],
  "CI/CD & Cloud": [
    "Docker", "Docker Compose", "Kubernetes", "OpenShift", "Terraform", "Jenkins",
    "GitHub Actions", "Trivy", "Falco", "Git/GitHub/GitLab",
  ],
  "Systèmes": ["Linux (Ubuntu/Kali/Red Hat)", "Windows Server", "Scripting Bash/Python"],
};

/* ============================================================
   VEILLE & APPRENTISSAGE en cours (dynamisme)
   ============================================================ */
const VEILLE = [
  { label: "CompTIA Security+", kind: "certification", note: "Préparation en cours — socle transversal." },
  { label: "Cloud Security (CKS mindset)", kind: "formation", note: "Durcissement de tenants & clusters, RBAC, secrets management." },
  { label: "OpenShift", kind: "formation", note: "Déploiement & sécurité de workloads sur plate-forme conteneurisée." },
  { label: "Purple Team automation", kind: "projet", note: "Automatiser la rejouabilité des scénarios de détection (SIGMA → SIEM)." },
  { label: "Windows internals & Blue", kind: "veille", note: "Mouvement latéral & logs ETW pour fiabiliser l'IR." },
];

/* ============================================================
   CONTACT (liens remplis) — ne pas laisser vides avant push
   ============================================================ */
const CONTACT = {
  email: PROFILE.email,
  phone: PROFILE.phone,
  github: PROFILE.github,
  linkedin: PROFILE.linkedin,
  rootme: PROFILE.rootme,
  hackerlab: PROFILE.hackerlab,
};
