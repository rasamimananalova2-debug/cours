-- ============================================
-- Schéma de base de données pour Supabase (PostgreSQL)
-- Compatible avec la structure de données de l'application
-- Cohérent avec le schéma de base de données fourni
-- ============================================

-- Suppression des tables existantes (pour développement)
DROP TABLE IF EXISTS chat_suggestions CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS deadlines CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS course_resources CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Suppression des types personnalisés
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS auth_provider CASCADE;
DROP TYPE IF EXISTS enrollment_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS course_category CASCADE;
DROP TYPE IF EXISTS resource_type CASCADE;
DROP TYPE IF EXISTS activity_type CASCADE;
DROP TYPE IF EXISTS assignment_status CASCADE;
DROP TYPE IF EXISTS lesson_status CASCADE;
DROP TYPE IF EXISTS conversation_category CASCADE;
DROP TYPE IF EXISTS message_sender CASCADE;

-- ============================================
-- Types personnalisés (ENUM)
-- ============================================
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE auth_provider AS ENUM ('credentials', 'google', 'github', 'email');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled', 'suspended');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('credit_card', 'paypal', 'stripe', 'bank_transfer');
CREATE TYPE course_category AS ENUM ('Tech', 'Design', 'Business', 'Langues');
CREATE TYPE resource_type AS ENUM ('pdf', 'code', 'article', 'dataset');
CREATE TYPE activity_type AS ENUM ('quiz', 'doc', 'badge');
CREATE TYPE assignment_status AS ENUM ('pending', 'submitted', 'graded');
CREATE TYPE lesson_status AS ENUM ('completed', 'current', 'locked');
CREATE TYPE conversation_category AS ENUM ('UX', 'Maths', 'Python', 'IA', 'General');
CREATE TYPE message_sender AS ENUM ('user', 'ai');

-- ============================================
-- Fonction pour updated_at automatique
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Table: Users
-- ============================================
CREATE TABLE users (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password_hash VARCHAR,
    google_id TEXT UNIQUE,
    picture TEXT,
    role user_role NOT NULL DEFAULT 'student',
    provider auth_provider NOT NULL DEFAULT 'google',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Index pour les recherches courantes
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Trigger pour updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: Categories
-- ============================================
CREATE TABLE categories (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    slug VARCHAR NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- ============================================
-- Table: Courses
-- ============================================
CREATE TABLE courses (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    category_id UUID,
    category VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0.00 CHECK (price >= 0.00),
    content_json JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00,
    reviews_count INTEGER DEFAULT 0,
    total_hours TEXT,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    badge TEXT,
    instructor_name TEXT,
    instructor_role TEXT,
    instructor_avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT courses_pkey PRIMARY KEY (id),
    CONSTRAINT courses_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_courses_popular ON courses(is_popular);
CREATE INDEX idx_courses_published ON courses(is_published);

-- Trigger pour updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: Modules
-- ============================================
CREATE TABLE modules (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT modules_pkey PRIMARY KEY (id),
    CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

-- ============================================
-- Table: Lessons
-- ============================================
CREATE TABLE lessons (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    content_type VARCHAR NOT NULL DEFAULT 'video',
    content_payload TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    duration TEXT,
    summary TEXT,
    video_poster_url TEXT,
    video_url TEXT,
    is_preview_allowed BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT lessons_pkey PRIMARY KEY (id),
    CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);

-- ============================================
-- Table: Course Resources
-- ============================================
CREATE TABLE course_resources (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    type resource_type NOT NULL,
    size_or_time TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT course_resources_pkey PRIMARY KEY (id),
    CONSTRAINT course_resources_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_resources_course_id ON course_resources(course_id);

-- ============================================
-- Table: Enrollments
-- ============================================
CREATE TABLE enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status enrollment_status NOT NULL DEFAULT 'active',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT enrollments_pkey PRIMARY KEY (id),
    CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Trigger pour updated_at
CREATE TRIGGER update_enrollments_updated_at
    BEFORE UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: Payments
-- ============================================
CREATE TABLE payments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    enrollment_id UUID,
    amount NUMERIC NOT NULL CHECK (amount >= 0.00),
    currency VARCHAR NOT NULL DEFAULT 'EUR',
    status payment_status NOT NULL DEFAULT 'pending',
    method payment_method NOT NULL,
    transaction_id VARCHAR NOT NULL UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT payments_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT payments_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_course_id ON payments(course_id);
CREATE INDEX idx_payments_enrollment_id ON payments(enrollment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- Trigger pour updated_at
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: User Progress
-- ============================================
CREATE TABLE user_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    enrollment_id UUID,
    progress_percent INTEGER DEFAULT 0,
    current_module_id UUID,
    current_lesson_id UUID,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_progress_pkey PRIMARY KEY (id),
    CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT user_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT user_progress_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL,
    CONSTRAINT user_progress_module_id_fkey FOREIGN KEY (current_module_id) REFERENCES modules(id) ON DELETE SET NULL,
    CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (current_lesson_id) REFERENCES lessons(id) ON DELETE SET NULL,
    UNIQUE (user_id, course_id)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX idx_user_progress_enrollment_id ON user_progress(enrollment_id);

-- Trigger pour updated_at
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: Lesson Progress (détail par leçon)
-- ============================================
CREATE TABLE lesson_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    status lesson_status DEFAULT 'locked',
    video_timestamp TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT lesson_progress_pkey PRIMARY KEY (id),
    CONSTRAINT lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- ============================================
-- Table: Activities
-- ============================================
CREATE TABLE activities (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    type activity_type NOT NULL,
    link_text VARCHAR,
    link_url TEXT,
    score VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT activities_pkey PRIMARY KEY (id),
    CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_timestamp ON activities(timestamp DESC);

-- ============================================
-- Table: Deadlines
-- ============================================
CREATE TABLE deadlines (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    deadline_label VARCHAR,
    time_remaining VARCHAR,
    date_badge VARCHAR,
    is_urgent BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT deadlines_pkey PRIMARY KEY (id),
    CONSTRAINT deadlines_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT deadlines_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_deadlines_user_id ON deadlines(user_id);
CREATE INDEX idx_deadlines_due_date ON deadlines(due_date);

-- ============================================
-- Table: Assignments
-- ============================================
CREATE TABLE assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status assignment_status DEFAULT 'pending',
    grade VARCHAR,
    max_grade VARCHAR,
    submitted_at TIMESTAMP WITH TIME ZONE,
    graded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT assignments_pkey PRIMARY KEY (id),
    CONSTRAINT assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_assignments_user_id ON assignments(user_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- Trigger pour updated_at
CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: Conversations
-- ============================================
CREATE TABLE conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    preview TEXT,
    category conversation_category DEFAULT 'General',
    time_label VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT conversations_pkey PRIMARY KEY (id),
    CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: Chat Messages
-- ============================================
CREATE TABLE chat_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender message_sender NOT NULL,
    text TEXT NOT NULL,
    code_language VARCHAR,
    code_code TEXT,
    note TEXT,
    course_timestamp_action VARCHAR,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
    CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp ASC);

-- ============================================
-- Table: Suggestions (pour les messages AI)
-- ============================================
CREATE TABLE chat_suggestions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    suggestion_text TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chat_suggestions_pkey PRIMARY KEY (id),
    CONSTRAINT chat_suggestions_message_id_fkey FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE
);

CREATE INDEX idx_suggestions_message_id ON chat_suggestions(message_id);

-- ============================================
-- Données initiales (optionnel)
-- ============================================

-- Insertion des catégories
INSERT INTO categories (id, name, slug, description) VALUES
('cat-tech', 'Tech', 'tech', 'Technologies et programmation'),
('cat-design', 'Design', 'design', 'Design UX/UI et graphique'),
('cat-business', 'Business', 'business', 'Management et entrepreneuriat'),
('cat-langues', 'Langues', 'langues', 'Apprentissage des langues');

-- Insertion des cours depuis les données mock
INSERT INTO courses (id, category_id, category, title, description, price, is_published, rating, reviews_count, total_hours, image_url, is_popular, is_new, badge, instructor_name, instructor_role, instructor_avatar) VALUES
('course-ai-intro', 'cat-tech', 'Tech', 'Introduction à l''IA', 'Comprendre les fondements du machine learning et des réseaux de neurones pour des applications métiers.', 99.00, true, 4.8, 1800, '32h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKzXrSrVXj1pvOBhRs_LuEREvyfXUGJVyG7O_-p_gseFxPjLoq1TwU7MHK72Sbu2mDAW2hmpeeDY74yEFcL8mm1pN3Ci2F1FFFeKa5VWSxgzVUB12rHTRFyubfqmemIq6ftv17X_hE6ibN9v4c_Mu-UloKLYF40aJTW1Zy655YiTX4PM4HBqC6Scx98buwb9-31kH5A1iJpwwq0ryEf0E76dlhQu63baXLHogtNu8KUgfrpo1-kdU1Bg', FALSE, FALSE, 'Dernière session', 'Dr. Éric Moreau', 'Directeur de recherche en IA', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm7DNd5XEaLSSVSRxsIQLE6JwgpiRwOkAMj2gfyoQ1bOBQDdgjupJYZbyMCw-nyQI_oeLJsyLUDkkoD0qA_XsWd9rNX1SSES8QT2ohzVUZeg0JQMihaitsdz6EKOkVhWbkMQCXEJ2Feyph6H4TZFLXrlQA2mBVLjN2tWrk1pMoaosrlacHW_tjCKo7YxxZ_J81FYShDZ90nJ1UJiin58jgz2Sk1a7wFhvFgw8PE8XuCSdIZazblXFmBA'),
('course-ux-ui', 'cat-design', 'Design', 'Design UX/UI Avancé', 'Plongez dans les principes avancés du design d''interface et d''expérience utilisateur. Apprenez à créer des produits numériques exceptionnels qui captivent et convertissent.', 149.00, true, 4.9, 2400, '28h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCpAaK7ubVFpOcaVpqC7hTCv1_vMR2Ujv9mtoSgVhqMh872RolNRqMMYH2kW61Z-14X-Ny_eDof7PjwSRBZo4_swjfX1l_TdyeyD4GxqG20kvWWuYxBDhaT84NuMdMckMR4K9zMrlL0mJ38JzTO_mbyt6VQvu2H0nT8bt3fTHowEAs-Yxi1Z3cr7385-W60jh61x-l7qeSkG6LFdpADKe4se2n93FCH8EIRtNNCVP-myoVOpWoZfSC2Q', TRUE, TRUE, 'Projet en cours', 'Marie Dupont', 'Lead Designer', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq2sTlYvIlbBBfkwBf6uPN7egPQLK2YpHvw1Cp8LGDvHN6gnsfhcteokhVlQYDWK7F0PzN9nxMz3cPJmVxGYobOteL39Hd_owtu-sCt_D-7MIOqOzxV26IAsbhePnMwYa6DjfNRhdu_0YrcLY7eEdXf6gY28jNfq5IzTWwdzpZ04f6LwKPvK5BXuIJ9CqYlTyrT4xxToEGd-6bocC9ZJ1YN1IVhn4mZhno0Qi_tsv9vXQYhbt8YYygeg'),
('course-web-fullstack', 'cat-tech', 'Tech', 'Développement Web Full-Stack 2024', 'Maîtrisez React, Node.js et les bases de données modernes pour construire des applications complètes et performantes.', 99.00, true, 4.7, 3100, '45h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYuhvTD4wg8Z-5UUmb7764QDplj32AMBTyYWSl6L-ZqR_77HVpO0O8rq0nccqbHSex5bxTGqqI_erLrywG3Rp7qGV3mRWBwNRWzwpcFkyP32Smp6RSvigK88EsQHwVWbJnflD_VjrY6QU69lJePHHvHwN9XbvWTuaeVXhk0XdJelPPsiF5CXhOfYcx3TvoeSBQHCVVuHjnv6m34szVqMPOR6eCLXdYPRj0f53wQf9nyZ_gC-ltWL-N2Q', FALSE, FALSE, 'Module final', 'Jean Martin', 'Architecte Logiciel', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm7DNd5XEaLSSVSRxsIQLE6JwgpiRwOkAMj2gfyoQ1bOBQDdgjupJYZbyMCw-nyQI_oeLJsyLUDkkoD0qA_XsWd9rNX1SSES8QT2ohzVUZeg0JQMihaitsdz6EKOkVhWbkMQCXEJ2Feyph6H4TZFLXrlQA2mBVLjN2tWrk1pMoaosrlacHW_tjCKo7YxxZ_J81FYShDZ90nJ1UJiin58jgz2Sk1a7wFhvFgw8PE8XuCSdIZazblXFmBA'),
('course-leadership', 'cat-business', 'Business', 'Leadership et Management d''Équipe', 'Stratégies éprouvées pour motiver, guider et exceller en tant que manager dans le monde moderne.', 0.00, true, 4.8, 980, '16h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpO-WQx507MBfPGSDnce74euZVD3Ykn_GmL-gjFh_Ih5L9UZmj2NOXSajSfNfuiMiTLbv1Nhlbu7guQJ4mzOh5DKwX71GX9G_403EHzFE8Aoa6aJyBtIIeyJM8tWZhlnuLNsQLWYqGeoYKxBqNbAytp4zFaQGHRhFsze01BJtjMnuDnOpIsceh-6pAOSh87EqiJnK1dsrPiCWWGktALTpWhIjfJRRDsfVCb5AvrK4TQx416Snjt4ssbw', FALSE, FALSE, NULL, 'Sophie Laurent', 'Coach Exécutif & Auteure', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuuzZOyYwmsI2jisimDjbN3wESIpKW-ni_U8fDQ_TQbTNSBC-GP1J21w0QGkEGvC8g1Zof-NAoVmwTV48XpsaBuSmT1BBECJM8JZ1kFh8HuI-1zpzOJb589dLmqmS9wJIzrjL2dDVB0nkGYLdSM76Uw3YwDiQ95XSJNsO80T8K6tFJ55shtU3xcF7CnV6C2a5mKZX43_veTErsF8Jqr-NViyBpKcCRjNzhGAWkmjax6bXlUj1v8eHWYA'),
('course-business-english', 'cat-langues', 'Langues', 'Anglais des Affaires : Niveau C1', 'Perfectionnez votre anglais professionnel pour les négociations, présentations et la correspondance d''entreprise.', 59.00, true, 4.6, 1200, '20h', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdapQT3QD47aYr8PPmvjP9UMLyWgGONkKECuBA-1MgY6R4ZU_WlxsbWIcVeY5JIkZfMFiPQKrgvxyehksTfIySKZnuaNOXcMbPhQVRDtR0h6G_c4TJmL2kSN60B5L5h002i4tcmL8N7mTxADVncNEDIw0DvZPvXya286gBKS2pzq9lIMyCnGOiQbT5YXXfm6zX7YRrwu6tzk557ZeU4vw7WGowhcap6BF-kFClKbudwB0fqQ1VvGrY2Q', FALSE, FALSE, NULL, 'Thomas Weber', 'Formateur Linguistique International', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsWVGwHm93GwLZki2kHJXBA5xGr4xpX0ekeUpegG7pv-6hHUPVHIrxf7P27IOcMdpBZqJTe78R_RFXuKML_Jc5vL6N7dvTJjM01tE5AkBtbE2RqOa0gcaW3gVa_8d_r-nWEVgzCN5nx6_7iqjReCFoPLQbs8DwLDeg_ema2pMwdi4JkimVZ3HrF37YN48icXnHkxWZvTxEdiL-Ay-HeSvXJkl9DnLgG1k5bxwSZGfUoUMm8Av951of4Q');

-- Insertion des modules pour le cours IA
INSERT INTO modules (id, course_id, title, order_index) VALUES
('mod-1', 'course-ai-intro', 'Module 1: Fondations', 1),
('mod-2', 'course-ai-intro', 'Module 2: Réseaux Profonds', 2);

-- Insertion des leçons pour le cours IA
INSERT INTO lessons (id, module_id, title, content_type, content_payload, duration_seconds, duration, summary, video_poster_url, order_index) VALUES
('lesson-1', 'mod-1', '1. Introduction à l''IA', 'video', 'https://example.com/video1', 750, '12:30', 'Vue d''ensemble de l''intelligence artificielle et son histoire.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKzXrSrVXj1pvOBhRs_LuEREvyfXUGJVyG7O_-p_gseFxPjLoq1TwU7MHK72Sbu2mDAW2hmpeeDY74yEFcL8mm1pN3Ci2F1FFFeKa5VWSxgzVUB12rHTRFyubfqmemIq6ftv17X_hE6ibN9v4c_Mu-UloKLYF40aJTW1Zy655YiTX4PM4HBqC6Scx98buwb9-31kH5A1iJpwwq0ryEf0E76dlhQu63baXLHogtNu8KUgfrpo1-kdU1Bg', 1),
('lesson-2', 'mod-1', '2. Machine Learning vs Deep Learning', 'video', 'https://example.com/video2', 1125, '18:45', 'Différences conceptuelles et algorithmiques fondamentales.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKzXrSrVXj1pvOBhRs_LuEREvyfXUGJVyG7O_-p_gseFxPjLoq1TwU7MHK72Sbu2mDAW2hmpeeDY74yEFcL8mm1pN3Ci2F1FFFeKa5VWSxgzVUB12rHTRFyubfqmemIq6ftv17X_hE6ibN9v4c_Mu-UloKLYF40aJTW1Zy655YiTX4PM4HBqC6Scx98buwb9-31kH5A1iJpwwq0ryEf0E76dlhQu63baXLHogtNu8KUgfrpo1-kdU1Bg', 2),
('lesson-3', 'mod-2', '3. Architecture des Réseaux de Neurones', 'video', 'https://example.com/video3', 1960, '32:40', 'Comprendre les couches cachées, les poids et l''apprentissage par propagation arrière.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxG1yNV4qihl4gfhYXBlxpHgRn02hbpo3Gc7BQ27j6zjsD9AbGJyhTno_Zgg4lZ5jV9sYBDkANHwdH-8RInKHwcepyTJrYdoLE3yEN2XMg1P1xe1iZEDCV5ljSwjHuN0z4SF3qXa_meGAYvdzTD8kkrl0_0SS0la8WEUH9nMw2EqNDft-WRgtwf_MLi2lpWNxuYLAxvnMEAvgdFEoYaOAJ_mZ_7xsmqeOWsnO6p4tdG67FQwNVsFN6EA', 1),
('lesson-4', 'mod-2', '4. Fonctions d''activation', 'video', 'https://example.com/video4', 920, '15:20', 'ReLU, Sigmoid, Softmax et leurs applications.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxG1yNV4qihl4gfhYXBlxpHgRn02hbpo3Gc7BQ27j6zjsD9AbGJyhTno_Zgg4lZ5jV9sYBDkANHwdH-8RInKHwcepyTJrYdoLE3yEN2XMg1P1xe1iZEDCV5ljSwjHuN0z4SF3qXa_meGAYvdzTD8kkrl0_0SS0la8WEUH9nMw2EqNDft-WRgtwf_MLi2lpWNxuYLAxvnMEAvgdFEoYaOAJ_mZ_7xsmqeOWsnO6p4tdG67FQwNVsFN6EA', 2),
('lesson-5', 'mod-2', '5. Rétropropagation du gradient', 'video', 'https://example.com/video5', 1510, '25:10', 'Descente de gradient stochastique et optimisation Adam.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxG1yNV4qihl4gfhYXBlxpHgRn02hbpo3Gc7BQ27j6zjsD9AbGJyhTno_Zgg4lZ5jV9sYBDkANHwdH-8RInKHwcepyTJrYdoLE3yEN2XMg1P1xe1iZEDCV5ljSwjHuN0z4SF3qXa_meGAYvdzTD8kkrl0_0SS0la8WEUH9nMw2EqNDft-WRgtwf_MLi2lpWNxuYLAxvnMEAvgdFEoYaOAJ_mZ_7xsmqeOWsnO6p4tdG67FQwNVsFN6EA', 3);

-- Insertion des ressources pour le cours IA
INSERT INTO course_resources (id, course_id, title, type, size_or_time, url) VALUES
('res-1', 'course-ai-intro', 'Slides du cours', 'pdf', 'PDF • 2.4 MB', '#'),
('res-2', 'course-ai-intro', 'Code source (Google Colab)', 'code', 'Lien externe', 'https://colab.research.google.com/'),
('res-3', 'course-ai-intro', 'Lecture recommandée: Deep Learning Book', 'article', 'Article • Temps estimé: 10m', '#');
