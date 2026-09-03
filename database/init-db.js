const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cours_platform',
    multipleStatements: true
  });

  try {
    console.log('📦 Connexion à la base de données réussie');

    // Lire le fichier schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Exécuter le schéma
    await connection.query(schema);
    console.log('✅ Schéma de base de données créé avec succès');

    // Afficher les statistiques
    const [courses] = await connection.query('SELECT COUNT(*) as count FROM courses');
    const [modules] = await connection.query('SELECT COUNT(*) as count FROM modules');
    const [lessons] = await connection.query('SELECT COUNT(*) as count FROM lessons');
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');

    console.log('\n📊 Statistiques de la base de données:');
    console.log(`   - Cours: ${courses[0].count}`);
    console.log(`   - Modules: ${modules[0].count}`);
    console.log(`   - Leçons: ${lessons[0].count}`);
    console.log(`   - Utilisateurs: ${users[0].count}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    throw error;
  } finally {
    await connection.end();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter l'initialisation
initializeDatabase()
  .then(() => {
    console.log('🎉 Initialisation terminée avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Échec de l\'initialisation');
    process.exit(1);
  });
