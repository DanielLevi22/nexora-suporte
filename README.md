## Configuração local

### 1. Clonar o repositório

```bash
git clone https://github.com/DanielLevi22/nexora-suporte.git
cd nexora-suporte
```

### 2. Instalar as dependências

O projeto utiliza Node.js 24 e pnpm 11.25.0.

```bash
pnpm install --frozen-lockfile
```

### 3. Configurar as variáveis de ambiente

Na raiz do monorepo, copie `.env.example` para `.env`.

No PowerShell:

```powershell
Copy-Item .env.example .env
Copy-Item apps/backend/.env.example apps/backend/.env
```

Configure as credenciais do banco de dados nos dois arquivos.

**Docker Compose — `.env` da raiz:**

```dotenv
MYSQL_PORT=3306
MYSQL_DATABASE=nexora
MYSQL_USER=nexora_user
MYSQL_PASSWORD=defina_uma_senha_local
MYSQL_ROOT_PASSWORD=defina_outra_senha_local
```

**NestJS — `apps/backend/.env`:**

```dotenv
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=nexora_user
DB_PASSWORD=defina_uma_senha_local
DB_NAME=nexora
```

A senha `DB_PASSWORD` deve corresponder à `MYSQL_PASSWORD`.

Nunca versione arquivos `.env` com credenciais reais.

### 4. Iniciar o banco de dados

```bash
docker compose up -d
docker compose ps
```

O MySQL utiliza um volume persistente para preservar os dados.

Para encerrar os serviços sem remover o volume:

```bash
docker compose down
```

### 5. Executar as migrations

```bash
pnpm --filter backend db:migrate
```

O executor consulta a tabela `schema_migrations`, identifica migrations pendentes e executa os arquivos SQL ainda não registrados.

Migrations já registradas não são executadas novamente.

### 6. Executar o backend

```bash
pnpm --filter backend start:dev
```

Endpoint inicial:

`GET http://localhost:3000/health`

### 7. Executar o frontend

```bash
pnpm --filter web start
```

A aplicação Angular fica disponível, por padrão, em:

`http://localhost:4200`

### 8. Executar o mobile

O aplicativo utiliza React Native com Expo.

Após confirmar a configuração do workspace mobile:

```bash
pnpm --filter mobile start
```

Para compilar e executar no Android:

```bash
pnpm --filter mobile exec expo run:android
```

### 9. Executar os testes

Backend:

```bash
pnpm --filter backend test
```

Frontend:

```bash
pnpm --filter web exec ng test --watch=false
```

### 10. Validar os builds

Backend:

```bash
pnpm --filter backend build
```

Frontend:

```bash
pnpm --filter web build
```

A compilação nativa Android depende da configuração do SDK, JDK e ferramentas de build.

## Fluxo de desenvolvimento

O projeto utiliza GitHub Issues, branches por atividade e Pull Requests para integração das alterações.

As modificações devem passar por testes e validação antes do merge na branch `main`.
