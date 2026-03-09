# Instituto RME — Backend FastAPI

## Instalação

```bash
pip install -r requirements.txt
```

## Executar

```bash
# Popula o banco com dados de teste
python seed.py

# Inicia o servidor
uvicorn app.main:app --reload
```

Acesse:
- **Frontend (Primeiro Acesso):** http://localhost:8000
- **Login:** http://localhost:8000/login.html
- **Docs da API:** http://localhost:8000/docs

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/cadastro/validar-matricula` | Valida se matrícula existe e não tem cadastro |
| POST | `/api/v1/cadastro/criar-credenciais` | Cria email/senha para o aluno |
| POST | `/api/v1/cadastro/login` | Autentica e retorna JWT |

## Fluxo de Cadastro

1. Aluno informa matrícula → sistema valida
2. Aluno cria email + senha → sistema vincula ao usuário
3. Aluno faz login → recebe JWT com perfil (`aluno` / `professor` / `administrador`)

## Banco de Dados

Por padrão usa **SQLite** (`rme.db`). Para usar MySQL/PostgreSQL, altere `DATABASE_URL` no `.env`:

```env
DATABASE_URL=mysql+pymysql://user:pass@localhost/rme
# ou
DATABASE_URL=postgresql://user:pass@localhost/rme
```
