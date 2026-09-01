# 🎓 EduSmart — Portail Académique & Plateforme d'Apprentissage

EduSmart est une plateforme académique et un portail d'apprentissage intelligent nouvelle génération conçu avec **React 19**, **TypeScript**, **Tailwind CSS v4** et **Vite**.

Elle intègre un lecteur multimédia interactif, un tuteur IA conversationnel (**EduBot**), un système de thématisation dynamique avec **mode sombre natif**, et un moteur d'optimisation d'images haute performance (**FastImage**) avec lazy loading, indicateurs de progression et mise en cache mémoire.

---

## 📋 Table des Matières

- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage & Scripts](#-démarrage--scripts)
- [Architecture du Projet](#-architecture-du-projet)
- [Moteur FastImage & Optimisations](#-moteur-fastimage--optimisations)
- [Déploiement & Build de Production](#-déploiement--build-de-production)

---

## ✨ Fonctionnalités Principales

- **📊 Tableau de Bord Académique** : Vue globale de la progression, objectif d'heures hebdomadaire avec jauge circulaire, grille bento des cours en cours et échéancier des devoirs.
- **🎥 Lecteur de Cours Multimédia** : Scrubber vidéo interactif, chapitrage temporel, prise de notes synchronisée, ressources téléchargeables et saut direct vers les timestamps depuis les réponses de l'IA.
- **🤖 Tuteur IA Conversationnel (EduBot)** : Assistant d'aide aux devoirs avec coloration syntaxique de code, suggestions contextuelles et bouton d'accès rapide flottant.
- **📚 Catalogue & Masterclasses** : Filtres par filières (Tech, Design, Business, Langues), barre de recherche en temps réel et inscription aux cours.
- **🌓 Mode Sombre & Palettes Avancées** : Bascule instantanée Clair / Sombre / Système, 4 palettes chromatiques (*Classic*, *Teal*, *Cyberpunk*, *Amber*).
- **♿ Accessibilité & Lisibilité** : Mode contraste renforcé (WCAG AAA), échelle de police dynamique (100%, 110%, 120%) et mode réduction des mouvements (*Reduced Motion*).
- **⚡ Moteur FastImage** : Chargement progressif à 60 FPS, simulateur de vitesse réseau (4G/Fibre, 3G Rapide, 3G Lente, Hors-ligne), inspecteur de cache et mode économiseur de données.

---

## 💻 Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- **Node.js** : version **18.x** ou supérieure (Node.js 20+ recommandé)
- **Gestionnaire de paquets** : **npm** (inclus avec Node.js), **pnpm** ou **yarn**

Vérifiez vos versions avec :
```bash
node -v
npm -v
```

---

## 🚀 Installation

1. **Cloner ou télécharger le dépôt :**
   ```bash
   git clone <URL_DU_DEPOT>
   cd edusmart-portal
   ```

2. **Installer les dépendances du projet :**
   ```bash
   npm install
   ```

---

## ⚙️ Configuration

### Variables d'environnement (Optionnel)

Si vous utilisez des fonctionnalités étendues (ex: intégration de modèles Gemini côté serveur) :

1. Créez un fichier `.env` à la racine du projet :
   ```bash
   cp .env.example .env 2>/dev/null || touch .env
   ```

2. Définissez les clés nécessaires dans le fichier `.env` :
   ```env
   # Clé API Google Gemini (si applicable pour l'IA côté serveur)
   GEMINI_API_KEY=votre_cle_api_ici
   ```

---

## 🛠️ Démarrage & Scripts

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement local sur `http://localhost:3000` |
| `npm run build` | Compile l'application TypeScript et génère les fichiers statiques optimisés dans `dist/` |
| `npm run preview` | Prévisualise en local le build de production généré |
| `npm run lint` | Vérifie les types TypeScript et la conformité du code sans émettre de fichiers |
| `npm run clean` | Nettoie les dossiers de build temporaires (`dist/`) |

### Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrez ensuite votre navigateur sur **[http://localhost:3000](http://localhost:3000)**.

---

## 📂 Architecture du Projet

```text
├── index.html                  # Point d'entrée HTML principal
├── package.json                # Dépendances et scripts du projet
├── tsconfig.json               # Configuration du compilateur TypeScript
├── vite.config.ts              # Configuration Vite + plugin Tailwind CSS
├── src/
│   ├── main.tsx                # Point de montage React
│   ├── App.tsx                 # Composant racine et gestion des routes/vues
│   ├── index.css               # Styles globaux Tailwind CSS (@import "tailwindcss")
│   ├── types.ts                # Définition des types et interfaces TypeScript
│   ├── data/
│   │   └── mockData.ts         # Données académiques initiales (cours, leçons, devoirs)
│   ├── context/
│   │   ├── AppContext.tsx      # État global (navigation, progression, tuteur IA, devoirs)
│   │   └── ThemeContext.tsx    # Gestionnaire du thème (sombre/clair, palettes, A11Y, réseau)
│   ├── services/
│   │   └── imageOptimizer.ts   # Cache mémoire d'images et simulateur de débit réseau
│   ├── components/
│   │   ├── FastImage.tsx       # Composant d'image haute performance avec indicateur de chargement
│   │   ├── Header.tsx          # Barre de navigation supérieure (recherche, notifications, profil)
│   │   ├── Sidebar.tsx         # Menu de navigation latérale rétractable
│   │   ├── FloatingEduBot.tsx  # Bouton flottant d'accès rapide au tuteur IA
│   │   ├── CacheInspectorModal.tsx # Inspecteur de cache et métriques de bande passante
│   │   ├── ThemeCustomizerModal.tsx# Panneau rapide de personnalisation du thème
│   │   └── UpgradeModal.tsx    # Modal de passage au compte Premium
│   └── views/
│       ├── DashboardView.tsx   # Tableau de bord principal de l'étudiant
│       ├── CoursePlayerView.tsx# Lecteur de cours multimédia & sommatif
│       ├── CatalogView.tsx     # Exploration des formations et masterclasses
│       ├── MyCoursesView.tsx   # Mes cours inscrits et filtrage par statut
│       ├── MessagesView.tsx    # Espace de tutorat IA et messagerie académique
│       ├── AssignmentsView.tsx # Suivi des devoirs, rendus et notations
│       └── SettingsView.tsx    # Paramètres de compte, accessibilité et performances
```

---

## ⚡ Moteur FastImage & Optimisations

Le composant `<FastImage />` a été développé spécifiquement pour garantir un rendu fluide même avec des listes denses de médias :

- **Lazy Loading Intelligent** : Détecte l'entrée dans le viewport via `IntersectionObserver`.
- **Indicateurs Visuels** : Affiche une jauge circulaire animée de progression (`0%` à `100%`) pendant le chargement.
- **Cache en Mémoire Vive** : Conserve les URLs d'objets en mémoire pour un affichage instantané lors des réaffichages.
- **Inspecteur de Cache** : Accessible depuis les paramètres ou le bouton d'inspection rapide pour analyser les taux de cache hit/miss et le volume de données économisé.
- **Simulateur Réseau** : Permet de tester le comportement sous diverses conditions de réseau (*Fibre/4G*, *3G Rapide*, *3G Lente*, *Hors-ligne*).

---

## 📦 Déploiement & Build de Production

Pour générer une version prête pour la mise en production :

```bash
npm run build
```

Les fichiers compilés et minifiés sont générés dans le dossier `/dist`. Vous pouvez déployer ce dossier sur n'importe quelle plateforme d'hébergement statique ou serveur Web (Cloud Run, Vercel, Netlify, Nginx, Apache, etc.).

Pour tester le livrable de production en local :
```bash
npm run preview
```
