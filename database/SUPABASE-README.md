# Base de données Supabase (PostgreSQL)

Ce fichier contient le schéma PostgreSQL prêt à être utilisé sur Supabase, cohérent avec le schéma de base de données fourni.

## � Structure de la base de données

### Tables principales

- **users** - Utilisateurs avec authentification (Google, credentials)
- **categories** - Catégories de cours
- **courses** - Cours avec relation vers categories
- **modules** - Modules de cours
- **lessons** - Leçons avec contenu flexible
- **course_resources** - Ressources associées aux cours
- **enrollments** - Inscriptions aux cours
- **payments** - Paiements et transactions
- **user_progress** - Progression des utilisateurs
- **lesson_progress** - Progression détaillée par leçon
- **activities** - Activités des utilisateurs
- **deadlines** - Échéances des devoirs
- **assignments** - Devoirs et travaux
- **conversations** - Conversations avec le bot IA
- **chat_messages** - Messages des conversations
- **chat_suggestions** - Suggestions de réponses IA

### Types personnalisés (ENUM)

- **user_role** - Rôles utilisateurs (student, instructor, admin)
- **auth_provider** - Fournisseurs d'auth (credentials, google, github, email)
- **enrollment_status** - Statuts d'inscription (active, completed, cancelled, suspended)
- **payment_status** - Statuts de paiement (pending, completed, failed, refunded)
- **payment_method** - Méthodes de paiement (credit_card, paypal, stripe, bank_transfer)
- **course_category** - Catégories de cours (Tech, Design, Business, Langues)
- **resource_type** - Types de ressources (pdf, code, article, dataset)
- **activity_type** - Types d'activités (quiz, doc, badge)
- **assignment_status** - Statuts de devoirs (pending, submitted, graded)
- **lesson_status** - Statuts de leçons (completed, current, locked)
- **conversation_category** - Catégories de conversation (UX, Maths, Python, IA, General)
- **message_sender** - Expéditeurs de messages (user, ai)

## �🚀 Installation sur Supabase

### Méthode 1: Via l'éditeur SQL Supabase (recommandé)

1. Connectez-vous à votre projet Supabase
2. Allez dans l'onglet "SQL Editor"
3. Copiez le contenu de `schema-supabase.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur "Run" pour exécuter

### Méthode 2: Via CLI Supabase

1. Installez la CLI Supabase :
```bash
npm install -g supabase
```

2. Initialisez le projet :
```bash
supabase login
supabase init
```

3. Exécutez le schéma :
```bash
supabase db push
```

### Méthode 3: Via psql (ligne de commande)

1. Récupérez vos identifiants Supabase depuis le dashboard
2. Exécutez :
```bash
psql -h db.xxx.supabase.co -U postgres -d postgres -f database/schema-supabase.sql
```

## 📋 Configuration des variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
VITE_SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## 🔧 Utilisation avec TypeScript

### Installation des dépendances

```bash
bun add @supabase/supabase-js
```

### Configuration du client Supabase

Créez `src/config/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Exemples de requêtes

```typescript
import { supabase } from './config/supabase';

// Récupérer tous les cours publiés
async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true);
  
  if (error) throw error;
  return data;
}

// Récupérer les inscriptions d'un utilisateur
async function getUserEnrollments(userId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

// Créer une inscription
async function createEnrollment(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert([{
      user_id: userId,
      course_id: courseId,
      status: 'active'
    }])
    .select();
  
  if (error) throw error;
  return data;
}

// Créer un paiement
async function createPayment(paymentData: {
  user_id: string;
  course_id: string;
  enrollment_id: string;
  amount: number;
  method: string;
  transaction_id: string;
}) {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select();
  
  if (error) throw error;
  return data;
}
```

## 🔐 RLS (Row Level Security)

Pour activer la sécurité au niveau des lignes sur Supabase :

```sql
-- Activer RLS sur la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de lire leur propre profil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);

-- Activer RLS sur enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Politique pour les inscriptions utilisateur
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Activer RLS sur payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid()::text = user_id);
```

## 📊 Caractéristiques du schéma

### UUID comme identifiants primaires
- Toutes les tables utilisent `UUID` avec `gen_random_uuid()` comme défaut
- Plus sécurisé et évite les collisions d'IDs
- Compatible avec Supabase Auth

### Contraintes de validation
- Email validation avec regex dans la table users
- Prix positifs avec `CHECK (price >= 0.00)`
- Transaction IDs uniques pour les paiements

### Clés étrangères avec CASCADE
- Maintient l'intégrité référentielle automatique
- `ON DELETE CASCADE` pour les relations utilisateur
- `ON DELETE SET NULL` pour les relations optionnelles

### Triggers automatiques
- Fonction `update_updated_at_column()` pour les timestamps
- Appliqué à toutes les tables avec `updated_at`

### Types personnalisés
- ENUMs pour garantir la cohérence des données
- Types fortement typés pour les statuts et catégories

## 🔄 Migration depuis l'ancien schéma

Si vous migrez depuis l'ancien schéma, voici les principales conversions :

- `TEXT` → `UUID` pour les identifiants primaires
- `VARCHAR` → `VARCHAR` avec validation regex pour email
- `TEXT` → `NUMERIC` pour les prix
- Ajout de `categories` table avec relation `category_id`
- Ajout de `enrollments` table pour gérer les inscriptions
- Ajout de `payments` table pour les transactions
- Ajout de `content_json` et `content_payload` pour flexibilité
- Ajout de `is_published` pour gérer la publication des cours

## 🛠️ Maintenance

### Sauvegarde via Supabase CLI

```bash
supabase db dump -f backup.sql
```

### Restauration

```bash
supabase db reset
```

### Visualisation des données

Utilisez le tableau de bord Supabase pour visualiser et éditer les données directement.

## 📝 Notes importantes

- Le schéma utilise des UUIDs comme identifiants primaires
- Les types personnalisés garantissent la cohérence des données
- Les triggers gèrent automatiquement les `updated_at`
- Les clés étrangères avec `CASCADE` maintiennent l'intégrité
- Compatible avec Supabase Auth pour l'authentification
- Prêt pour l'intégration de paiements avec Stripe
- Structure cohérente avec le schéma de base de données fourni

## 🔗 Liens utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Client JavaScript Supabase](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [UUID Functions](https://www.postgresql.org/docs/current/functions-uuid.html)
