# Base de données de la plateforme de cours

Ce dossier contient tous les fichiers nécessaires pour configurer et initialiser la base de données MySQL conforme à la structure de données de l'application.

## 📁 Structure

```
database/
├── schema.sql          # Schéma SQL complet avec tables et données initiales
├── init-db.js          # Script d'initialisation de la base de données
└── README.md           # Ce fichier
```

## 🗄️ Schéma de la base de données

### Tables principales

- **users** - Utilisateurs authentifiés (Google OAuth)
- **courses** - Cours disponibles sur la plateforme
- **modules** - Modules de cours
- **lessons** - Leçons individuelles
- **course_resources** - Ressources associées aux cours (PDF, code, articles)
- **user_progress** - Progression des utilisateurs dans les cours
- **lesson_progress** - Progression détaillée par leçon
- **activities** - Activités des utilisateurs (quiz, documents, badges)
- **deadlines** - Échéances des devoirs
- **assignments** - Devoirs et travaux
- **conversations** - Conversations avec le bot IA
- **chat_messages** - Messages des conversations
- **chat_suggestions** - Suggestions de réponses IA

## 🚀 Installation

### Prérequis

- MySQL 8.0 ou supérieur
- Node.js (pour le script d'initialisation)
- npm ou bun

### Configuration

1. Copiez le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

2. Configurez les variables d'environnement dans `.env` :
```env
VITE_DB_HOST="localhost"
VITE_DB_USER="root"
VITE_DB_PASSWORD="votre_mot_de_passe"
VITE_DB_NAME="cours_platform"
VITE_DB_PORT="3306"
```

### Initialisation

#### Option 1: Via le script Node.js (recommandé)

1. Installez les dépendances :
```bash
npm install mysql2 dotenv
# ou
bun add mysql2 dotenv
```

2. Exécutez le script d'initialisation :
```bash
node database/init-db.js
# ou
bun database/init-db.js
```

#### Option 2: Via MySQL directement

1. Connectez-vous à MySQL :
```bash
mysql -u root -p
```

2. Créez la base de données :
```sql
CREATE DATABASE cours_platform;
USE cours_platform;
```

3. Exécutez le schéma :
```sql
source database/schema.sql;
```

## 📊 Données initiales

Le schéma inclut des données initiales pour :
- 5 cours de démonstration
- Modules et leçons pour le cours "Introduction à l'IA"
- Ressources associées

## 🔧 Utilisation dans l'application

### Configuration TypeScript

Le fichier `src/config/database.ts` fournit une interface pour se connecter à la base de données :

```typescript
import { getConnection } from './config/database';

async function getCourses() {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM courses');
    return rows;
  } finally {
    connection.release();
  }
}
```

### Exemple de requête

```typescript
import { getPool } from './config/database';

async function getUserProgress(userId: string) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM user_progress WHERE user_id = ?',
    [userId]
  );
  return rows;
}
```

## 🔄 Migration

Pour mettre à jour le schéma de la base de données :

1. Modifiez le fichier `schema.sql`
2. Recréez la base de données (attention : cela supprime les données existantes)
3. Ou créez un script de migration séparé pour les modifications non destructives

## 🛠️ Maintenance

### Sauvegarde

```bash
mysqldump -u root -p cours_platform > backup.sql
```

### Restauration

```bash
mysql -u root -p cours_platform < backup.sql
```

### Réinitialisation

```bash
node database/init-db.js
```

## 📝 Notes importantes

- Le schéma utilise des clés étrangères avec `ON DELETE CASCADE` pour maintenir l'intégrité référentielle
- Les index sont optimisés pour les requêtes courantes
- Les types de données correspondent aux interfaces TypeScript définies dans `src/types.ts`
- Les timestamps sont gérés automatiquement avec `DEFAULT CURRENT_TIMESTAMP`

## 🔐 Sécurité

- Ne commitez jamais le fichier `.env` avec vos vrais identifiants
- Utilisez des mots de passe forts pour la base de données
- En production, utilisez des variables d'environnement sécurisées
- Limitez les privilèges de l'utilisateur de la base de données

## 📚 Compatibilité

Ce schéma est conçu pour être compatible avec :
- MySQL 8.0+
- MariaDB 10.5+
- TypeScript interfaces dans `src/types.ts`
- Structure de données dans `src/data/mockData.ts`
