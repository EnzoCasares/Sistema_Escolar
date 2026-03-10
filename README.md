### Estrutura de Pastas
Documentação detalhada de cada pasta principal:

```
Sistema_Escolar/
├── app/                    # Backend FastAPI
│   ├── api/               # Rotas da API
│   ├── core/              # Utilitários principais
│   ├── crud/              # Operações de banco de dados
│   ├── db/                # Configuração de banco de dados
│   ├── models/            # Modelos SQLAlchemy
│   ├── schemas/           # Schemas Pydantic
│   ├── config.py          # Configurações
│   └── main.py            # Inicialização FastAPI
│
├── frontend/              # Frontend HTML/CSS/JS
│   ├── aluno/             # Páginas do aluno
│   ├── professor/         # Páginas do professor
│   ├── css/               # Estilos CSS
│   ├── js/                # Scripts JavaScript
│   ├── images/            # Imagens
│   ├── index.html         # Página inicial
│   └── login.html         # Página de login
│
├── requirements.txt       # Dependências Python
└── README.md             # Este arquivo
```

### 📁 Descrição de Cada Pasta

- **app/**: Backend da aplicação com FastAPI
- **app/api/**: Rotas e endpoints da API REST
- **app/crud/**: Operações Create, Read, Update, Delete no banco de dados
- **app/db/**: Sessões e configurações do banco de dados
- **app/models/**: Modelos de dados (SQLAlchemy ORM)
- **app/schemas/**: Schemas de validação (Pydantic)
- **frontend/**: Interface do usuário em HTML/CSS/JavaScript
- **frontend/aluno/**: Funcionalidades e páginas para alunos
- **frontend/professor/**: Funcionalidades e páginas para professores

### 🚀 Como Rodar

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Configurar variáveis de ambiente (.env)
# Configure: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

# 3. Executar o servidor
uvicorn app.main:app --reload

# 4. Login no server
Aluno: aluno@rme.com | aluno123
Professor: prof1@rme.com | prof123

```