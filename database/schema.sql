-- ============================================
-- Schéma de base de données pour la plateforme de cours
-- Compatible avec la structure de données de l'application
-- ============================================

-- Suppression des tables existantes (pour développement)
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS deadlines;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS course_resources;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- ============================================
-- Table: Users
-- ============================================
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index pour les recherches courantes
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- Table: Courses
-- ============================================
CREATE TABLE courses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('Tech', 'Design', 'Business', 'Langues') NOT NULL,
    price VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0.00,
    reviews_count INT DEFAULT 0,
    total_hours VARCHAR(10),
    image_url TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    badge VARCHAR(100),
    instructor_name VARCHAR(255),
    instructor_role VARCHAR(255),
    instructor_avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_popular ON courses(is_popular);

-- ============================================
-- Table: Modules
-- ============================================
CREATE TABLE modules (
    id VARCHAR(255) PRIMARY KEY,
    course_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

-- ============================================
-- Table: Lessons
-- ============================================
CREATE TABLE lessons (
    id VARCHAR(255) PRIMARY KEY,
    module_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(10),
    duration_seconds INT,
    summary TEXT,
    video_poster_url TEXT,
    video_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);

-- ============================================
-- Table: Course Resources
-- ============================================
CREATE TABLE course_resources (
    id VARCHAR(255) PRIMARY KEY,
    course_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('pdf', 'code', 'article', 'dataset') NOT NULL,
    size_or_time VARCHAR(100),
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_resources_course_id ON course_resources(course_id);

-- ============================================
-- Table: User Progress
-- ============================================
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    progress_percent INT DEFAULT 0,
    current_module_id VARCHAR(255),
    current_lesson_id VARCHAR(255),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);

-- ============================================
-- Table: Lesson Progress (détail par leçon)
-- ============================================
CREATE TABLE lesson_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id VARCHAR(255) NOT NULL,
    status ENUM('completed', 'current', 'locked') DEFAULT 'locked',
    video_timestamp VARCHAR(20),
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- ============================================
-- Table: Activities
-- ============================================
CREATE TABLE activities (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('quiz', 'doc', 'badge') NOT NULL,
    link_text VARCHAR(255),
    link_url TEXT,
    score VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_timestamp ON activities(timestamp DESC);

-- ============================================
-- Table: Deadlines
-- ============================================
CREATE TABLE deadlines (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    deadline_label VARCHAR(100),
    time_remaining VARCHAR(100),
    date_badge VARCHAR(50),
    is_urgent BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_deadlines_user_id ON deadlines(user_id);
CREATE INDEX idx_deadlines_due_date ON deadlines(due_date);

-- ============================================
-- Table: Assignments
-- ============================================
CREATE TABLE assignments (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    status ENUM('pending', 'submitted', 'graded') DEFAULT 'pending',
    grade VARCHAR(50),
    max_grade VARCHAR(50),
    submitted_at TIMESTAMP NULL,
    graded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_assignments_user_id ON assignments(user_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- ============================================
-- Table: Conversations
-- ============================================
CREATE TABLE conversations (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    preview TEXT,
    category ENUM('UX', 'Maths', 'Python', 'IA', 'General') DEFAULT 'General',
    time_label VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- ============================================
-- Table: Chat Messages
-- ============================================
CREATE TABLE chat_messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL,
    sender ENUM('user', 'ai') NOT NULL,
    text TEXT NOT NULL,
    code_language VARCHAR(50),
    code_code TEXT,
    note TEXT,
    course_timestamp_action VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp ASC);

-- ============================================
-- Table: Suggestions (pour les messages AI)
-- ============================================
CREATE TABLE chat_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id VARCHAR(255) NOT NULL,
    suggestion_text VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE
);

CREATE INDEX idx_suggestions_message_id ON chat_suggestions(message_id);

-- ============================================
-- Données initiales (optionnel)
-- ============================================

-- Insertion des cours depuis les données mock
INSERT INTO courses (id, title, description, category, price, rating, reviews_count, total_hours, image_url, is_popular, is_new, badge, instructor_name, instructor_role, instructor_avatar) VALUES
('course-ai-intro', 'Introduction à l''IA', 'Comprendre les fondements du machine learning et des réseaux de neurones pour des applications métiers.', 'Tech', '99 €', 4.8, 1800, '32h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKzXrSrVXj1pvOBhRs_LuEREvyfXUGJVyG7O_-p_gseFxPjLoq1TwU7MHK72Sbu2mDAW2hmpeeDY74yEFcL8mm1pN3Ci2F1FFFeKa5VWSxgzVUB12rHTRFyubfqmemIq6ftv17X_hE6ibN9v4c_Mu-UloKLYF40aJTW1Zy655YiTX4PM4HBqC6Scx98buwb9-31kH5A1iJpwwq0ryEf0E76dlhQu63baXLHogtNu8KUgfrpo1-kdU1Bg', FALSE, FALSE, 'Dernière session', 'Dr. Éric Moreau', 'Directeur de recherche en IA', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm7DNd5XEaLSSVSRxsIQLE6JwgpiRwOkAMj2gfyoQ1bOBQDdgjupJYZbyMCw-nyQI_oeLJsyLUDkkoD0qA_XsWd9rNX1SSES8QT2ohzVUZeg0JQMihaitsdz6EKOkVhWbkMQCXEJ2Feyph6H4TZFLXrlQA2mBVLjN2tWrk1pMoaosrlacHW_tjCKo7YxxZ_J81FYShDZ90nJ1UJiin58jgz2Sk1a7wFhvFgw8PE8XuCSdIZazblXFmBA'),
('course-ux-ui', 'Design UX/UI Avancé', 'Plongez dans les principes avancés du design d''interface et d''expérience utilisateur. Apprenez à créer des produits numériques exceptionnels qui captivent et convertissent.', 'Design', '149 €', 4.9, 2400, '28h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCpAaK7ubVFpOcaVpqC7hTCv1_vMR2Ujv9mtoSgVhqMh872RolNRqMMYH2kW61Z-14X-Ny_eDof7PjwSRBZo4_swjfX1l_TdyeyD4GxqG20kvWWuYxBDhaT84NuMdMckMR4K9zMrlL0mJ38JzTO_mbyt6VQvu2H0nT8bt3fTHowEAs-Yxi1Z3cr7385-W60jh61x-l7qeSkG6LFdpADKe4se2n93FCH8EIRtNNCVP-myoVOpWoZfSC2Q', TRUE, TRUE, 'Projet en cours', 'Marie Dupont', 'Lead Designer', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq2sTlYvIlbBBfkwBf6uPN7egPQLK2YpHvw1Cp8LGDvHN6gnsfhcteokhVlQYDWK7F0PzN9nxMz3cPJmVxGYobOteL39Hd_owtu-sCt_D-7MIOqOzxV26IAsbhePnMwYa6DjfNRhdu_0YrcLY7eEdXf6gY28jNfq5IzTWwdzpZ04f6LwKPvK5BXuIJ9CqYlTyrT4xxToEGd-6bocC9ZJ1YN1IVhn4mZhno0Qi_tsv9vXQYhbt8YYygeg'),
('course-web-fullstack', 'Développement Web Full-Stack 2024', 'Maîtrisez React, Node.js et les bases de données modernes pour construire des applications complètes et performantes.', 'Tech', '99 €', 4.7, 3100, '45h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYuhvTD4wg8Z-5UUmb7764QDplj32AMBTyYWSl6L-ZqR_77HVpO0O8rq0nccqbHSex5bxTGqqI_erLrywG3Rp7qGV3mRWBwNRWzwpcFkyP32Smp6RSvigK88EsQHwVWbJnflD_VjrY6QU69lJePHHvHwN9XbvWTuaeVXhk0XdJelPPsiF5CXhOfYcx3TvoeSBQHCVVuHjnv6m34szVqMPOR6eCLXdYPRj0f53wQf9nyZ_gC-ltWL-N2Q', FALSE, FALSE, 'Module final', 'Jean Martin', 'Architecte Logiciel', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm7DNd5XEaLSSVSRxsIQLE6JwgpiRwOkAMj2gfyoQ1bOBQDdgjupJYZbyMCw-nyQI_oeLJsyLUDkkoD0qA_XsWd9rNX1SSES8QT2ohzVUZeg0JQMihaitsdz6EKOkVhWbkMQCXEJ2Feyph6H4TZFLXrlQA2mBVLjN2tWrk1pMoaosrlacHW_tjCKo7YxxZ_J81FYShDZ90nJ1UJiin58jgz2Sk1a7wFhvFgw8PE8XuCSdIZazblXFmBA'),
('course-leadership', 'Leadership et Management d''Équipe', 'Stratégies éprouvées pour motiver, guider et exceller en tant que manager dans le monde moderne.', 'Business', 'Inclus', 4.8, 980, '16h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpO-WQx507MBfPGSDnce74euZVD3Ykn_GmL-gjFh_Ih5L9UZmj2NOXSajSfNfuiMiTLbv1Nhlbu7guQJ4mzOh5DKwX71GX9G_403EHzFE8Aoa6aJyBtIIeyJM8tWZhlnuLNsQLWYqGeoYKxBqNbAytp4zFaQGHRhFsze01BJtjMnuDnOpIsceh-6pAOSh87EqiJnK1dsrPiCWWGktALTpWhIjfJRRDsfVCb5AvrK4TQx416Snjt4ssbw', FALSE, FALSE, NULL, 'Sophie Laurent', 'Coach Exécutif & Auteure', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuuzZOyYwmsI2jisimDjbN3wESIpKW-ni_U8fDQ_TQbTNSBC-GP1J21w0QGkEGvC8g1Zof-NAoVmwTV48XpsaBuSmT1BBECJM8JZ1kFh8HuI-1zpzOJb589dLmqmS9wJIzrjL2dDVB0nkGYLdSM76Uw3YwDiQ95XSJNsO80T8K6tFJ55shtU3xcF7CnV6C2a5mKZX43_veTErsF8Jqr-NViyBpKcCRjNzhGAWkmjax6bXlUj1v8eHWYA'),
('course-business-english', 'Anglais des Affaires : Niveau C1', 'Perfectionnez votre anglais professionnel pour les négociations, présentations et la correspondance d''entreprise.', 'Langues', '59 €', 4.6, 1200, '20h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdapQT3QD47aYr8PPmvjP9UMLyWgGONkKECuBA-1MgY6R4ZU_WlxsbWIcVeY5JIkZfMFiPQKrgvxyehksTfIySKZnuaNOXcMbPhQVRDtR0h6G_c4TJmL2kSN60B5L5h002i4tcmL8N7mTxADVncNEDIw0DvZPvXya286gBKS2pzq9lIMyCnGOiQbT5YXXfm6zX7YRrwu6tzk557ZeU4vw7WGowhcap6BF-kFClKbudwB0fqQ1VvGrY2Q', FALSE, FALSE, NULL, 'Thomas Weber', 'Formateur Linguistique International', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsWVGwHm93GwLZki2kHJXBA5xGr4xpX0ekeUpegG7pv-6hHUPVHIrxf7P27IOcMdpBZqJTe78R_RFXuKML_Jc5vL6N7dvTJjM01tE5AkBtbE2RqOa0gcaW3gVa_8d_r-nWEVgzCN5nx6_7iqjReCFoPLQbs8DwLDeg_ema2pMwdi4JkimVZ3HrF37YN48icXnHkxWZvTxEdiL-Ay-HeSvXJkl9DnLgG1k5bxwSZGfUoUMm8Av951of4Q');

-- Insertion des modules pour le cours IA
INSERT INTO modules (id, course_id, title, order_index) VALUES
('mod-1', 'course-ai-intro', 'Module 1: Fondations', 0),
('mod-2', 'course-ai-intro', 'Module 2: Réseaux Profonds', 1);

-- Insertion des leçons pour le cours IA
INSERT INTO lessons (id, module_id, title, duration, duration_seconds, summary, video_poster_url, order_index) VALUES
('lesson-1', 'mod-1', '1. Introduction à l''IA', '12:30', 750, 'Vue d''ensemble de l''intelligence artificielle et son histoire.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKzXrSrVXj1pvOBhRs_LuEREvyfXUGJVyG7O_-p_gseFxPjLoq1TwU7MHK72Sbu2mDAW2hmpeeDY74yEFcL8mm1pN3Ci2F1FFFeKa5VWSxgzVUB12rHTRFyubfqmemIq6ftv17X_hE6ibN9v4c_Mu-UloKLYF40aJTW1Zy655YiTX4PM4HBqC6Scx98buwb9-31kH5A1iJpwwq0ryEf0E76dlhQu63baXLHogtNu8KUgfrpo1-kdU1Bg', 0),
('lesson-2', 'mod-1', '2. Machine Learning vs Deep Learning', '18:45', 1125, 'Différences conceptuelles et algorithmiques fondamentales.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKzXrSrVXj1pvOBhRs_LuEREvyfXUGJVyG7O_-p_gseFxPjLoq1TwU7MHK72Sbu2mDAW2hmpeeDY74yEFcL8mm1pN3Ci2F1FFFeKa5VWSxgzVUB12rHTRFyubfqmemIq6ftv17X_hE6ibN9v4c_Mu-UloKLYF40aJTW1Zy655YiTX4PM4HBqC6Scx98buwb9-31kH5A1iJpwwq0ryEf0E76dlhQu63baXLHogtNu8KUgfrpo1-kdU1Bg', 1),
('lesson-3', 'mod-2', '3. Architecture des Réseaux de Neurones', '32:40', 1960, 'Comprendre les couches cachées, les poids et l''apprentissage par propagation arrière.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxG1yNV4qihl4gfhYXBlxpHgRn02hbpo3Gc7BQ27j6zjsD9AbGJyhTno_Zgg4lZ5jV9sYBDkANHwdH-8RInKHwcepyTJrYdoLE3yEN2XMg1P1xe1iZEDCV5ljSwjHuN0z4SF3qXa_meGAYvdzTD8kkrl0_0SS0la8WEUH9nMw2EqNDft-WRgtwf_MLi2lpWNxuYLAxvnMEAvgdFEoYaOAJ_mZ_7xsmqeOWsnO6p4tdG67FQwNVsFN6EA', 0),
('lesson-4', 'mod-2', '4. Fonctions d''activation', '15:20', 920, 'ReLU, Sigmoid, Softmax et leurs applications.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxG1yNV4qihl4gfhYXBlxpHgRn02hbpo3Gc7BQ27j6zjsD9AbGJyhTno_Zgg4lZ5jV9sYBDkANHwdH-8RInKHwcepyTJrYdoLE3yEN2XMg1P1xe1iZEDCV5ljSwjHuN0z4SF3qXa_meGAYvdzTD8kkrl0_0SS0la8WEUH9nMw2EqNDft-WRgtwf_MLi2lpWNxuYLAxvnMEAvgdFEoYaOAJ_mZ_7xsmqeOWsnO6p4tdG67FQwNVsFN6EA', 1),
('lesson-5', 'mod-2', '5. Rétropropagation du gradient', '25:10', 1510, 'Descente de gradient stochastique et optimisation Adam.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxG1yNV4qihl4gfhYXBlxpHgRn02hbpo3Gc7BQ27j6zjsD9AbGJyhTno_Zgg4lZ5jV9sYBDkANHwdH-8RInKHwcepyTJrYdoLE3yEN2XMg1P1xe1iZEDCV5ljSwjHuN0z4SF3qXa_meGAYvdzTD8kkrl0_0SS0la8WEUH9nMw2EqNDft-WRgtwf_MLi2lpWNxuYLAxvnMEAvgdFEoYaOAJ_mZ_7xsmqeOWsnO6p4tdG67FQwNVsFN6EA', 2);

-- Insertion des ressources pour le cours IA
INSERT INTO course_resources (id, course_id, title, type, size_or_time, url) VALUES
('res-1', 'course-ai-intro', 'Slides du cours', 'pdf', 'PDF • 2.4 MB', '#'),
('res-2', 'course-ai-intro', 'Code source (Google Colab)', 'code', 'Lien externe', 'https://colab.research.google.com/'),
('res-3', 'course-ai-intro', 'Lecture recommandée: Deep Learning Book', 'article', 'Article • Temps estimé: 10m', '#');
