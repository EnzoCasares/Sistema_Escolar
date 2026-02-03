
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('PROFESSOR', 'ALUNO'))
);

CREATE TABLE IF NOT EXISTS materias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    professor_id INTEGER NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notas (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    nota1 DECIMAL(4,2),
    nota2 DECIMAL(4,2),
    media DECIMAL(4,2),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    UNIQUE(aluno_id, materia_id)
);

CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL,
    professor_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    comentario TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

INSERT INTO usuarios (nome, matricula, email, senha, tipo) VALUES
('Ana Souza', 'ana.mat', 'ana.souza@escola.com', '123456', 'PROFESSOR'),
('Carlos Lima', 'carlos.port', 'carlos.lima@escola.com', '123456', 'PROFESSOR'),
('Juliana Rocha', 'juliana.hist', 'juliana.rocha@escola.com', '123456', 'PROFESSOR'),
('Marcos Pereira', 'marcos.cien', 'marcos.pereira@escola.com', '123456', 'PROFESSOR'),
('Diogo Nascimento', 'diogo.info', 'diogo.nascimento@escola.com', '123456', 'PROFESSOR')
ON CONFLICT (matricula) DO NOTHING;

INSERT INTO materias (nome, professor_id) 
SELECT 'Matemática', id FROM usuarios WHERE matricula = 'ana.mat'
ON CONFLICT DO NOTHING;

INSERT INTO materias (nome, professor_id) 
SELECT 'Português', id FROM usuarios WHERE matricula = 'carlos.port'
ON CONFLICT DO NOTHING;

INSERT INTO materias (nome, professor_id) 
SELECT 'História', id FROM usuarios WHERE matricula = 'juliana.hist'
ON CONFLICT DO NOTHING;

INSERT INTO materias (nome, professor_id) 
SELECT 'Ciências', id FROM usuarios WHERE matricula = 'marcos.cien'
ON CONFLICT DO NOTHING;

INSERT INTO materias (nome, professor_id) 
SELECT 'Informática', id FROM usuarios WHERE matricula = 'diogo.info'
ON CONFLICT DO NOTHING;
