# Nexora

> Plataforma SaaS B2B para gerenciamento de solicitações internas entre colaboradores, equipes e organizações.

A **Nexora** é um projeto de estudo e portfólio Full Stack, desenvolvido para praticar construção de produtos reais, arquitetura de software, SQL, testes automatizados, integração contínua e colaboração com GitHub Issues e Pull Requests.

> **Status:** em desenvolvimento. Este README descreve a visão do produto e a estrutura planejada; nem todos os módulos e comandos estão disponíveis ainda.

## Visão do produto

A Nexora pretende centralizar solicitações internas de uma organização, permitindo acompanhar responsáveis, prioridades, andamento e histórico de atendimento.

### Funcionalidades planejadas

- **Organizações:** isolamento de dados por organização (_multi-tenancy_).
- **Usuários e equipes:** cadastro e gerenciamento de colaboradores e responsáveis.
- **Solicitações:** abertura, categorização e acompanhamento de demandas.
- **Atendimento:** triagem, atribuição, priorização e resolução.
- **Histórico:** registro das mudanças de estado e ações relevantes.
- **Indicadores:** métricas de atendimento e acompanhamento de solicitações.

### Fluxo de negócio proposto

1. Um colaborador abre uma solicitação.
2. Um responsável faz a triagem e define prioridade e equipe.
3. Um atendente assume e trabalha na solicitação.
4. O atendente registra a resolução.
5. O solicitante confirma a solução ou contesta o resultado.
6. O histórico permanece disponível para auditoria.

## Stack tecnológica

| Camada         | Tecnologias                                      |
| -------------- | ------------------------------------------------ |
| Backend        | Node.js, TypeScript, NestJS                      |
| Web            | Angular, TypeScript                              |
| Mobile         | React Native, Expo                               |
| Banco de dados | MySQL 8.4 LTS                                    |
| Acesso a dados | SQL explícito com `mysql2` (sem ORM nesta fase)  |
| Ambiente local | Docker Compose                                   |
| Monorepo       | pnpm workspaces, Turborepo                       |
| Qualidade e CI | Testes automatizados, GitHub Actions (planejado) |

**Decisão de aprendizado:** a primeira implementação de persistência utilizará SQL diretamente para aprofundar modelagem relacional, `JOIN`, transações, índices, consultas parametrizadas e análise de desempenho.

## Estrutura do repositório

Estrutura **prevista** para o monorepo (pode evoluir conforme as Issues):

```text
nexora/
├── apps/
│   ├── api/                # API NestJS
│   ├── web/                # Aplicação Angular
│   └── mobile/             # Aplicação React Native / Expo
├── packages/               # Pacotes compartilhados (quando necessários)
├── .github/
│   └── workflows/          # Integração contínua
├── compose.yaml            # MySQL local (planejado)
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

## Pré-requisitos

- **Node.js 24 LTS**
- **pnpm** (usar a versão indicada pelo campo `packageManager` do `package.json`)
- **Git**
- **Docker Desktop + Docker Compose** para o MySQL local
- Para desenvolvimento mobile: **Expo Go** ou emulador Android/iOS configurado

> Em Windows, execute os comandos no PowerShell ou em um terminal compatível. Para o app mobile, requisitos adicionais dependem do dispositivo/emulador utilizado.

## Configuração local

### 1. Clonar o repositório

```bash
git clone https://github.com/DanielLevi22/nexora-suporte.git
cd nexora-suporte
```

### 2. Instalar as dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Quando os arquivos de exemplo estiverem disponíveis, copie os `.env.example` para `.env` nos diretórios correspondentes e configure os valores locais.

Exemplo de variáveis **planejadas** para o banco:

```dotenv
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=nexora
MYSQL_USER=nexora_app
MYSQL_PASSWORD=defina_uma_senha_local
MYSQL_ROOT_PASSWORD=defina_outra_senha_local
```

**Segurança:** não envie arquivos `.env`, senhas reais ou outros segredos para o Git. Os nomes finais das variáveis serão definidos na implementação das Issues de infraestrutura.

### 4. Iniciar o MySQL

Após a conclusão da configuração do Docker Compose (NEX-006):

```bash
docker compose up -d
# Consultar os logs
docker compose logs -f mysql
# Parar os serviços sem apagar os volumes
docker compose down
```

### 5. Executar as migrations do banco de dados

Após configurar as variáveis de ambiente e iniciar o MySQL, execute as migrations para preparar a estrutura do banco de dados.

No diretório da API, execute:

```bash
cd apps/api
pnpm db:migrate
```

O comando executa os arquivos SQL de migration que ainda não foram aplicados ao banco.

As migrations são utilizadas para versionar alterações na estrutura do banco de dados, como criação de tabelas, índices e relacionamentos.

**Controle de execução:**

- As migrations são executadas na ordem definida pelos arquivos.
- Cada migration executada é registrada na tabela `schema_migrations`.
- Migrations já registradas não são executadas novamente.
- Os arquivos SQL são versionados no Git, permitindo acompanhar a evolução da estrutura do banco.

Para consultar o histórico de migrations executadas:

```sql
SELECT * FROM schema_migrations;
```

**Observação:** `db:migrate` executa migrations existentes. Novos arquivos de migration devem ser criados separadamente.

### 6. Executar a API

Após executar as migrations, inicie a API NestJS:

```bash
pnpm start:dev
```

Execute esse comando no diretório `apps/api`, desde que o script esteja configurado no `package.json`.

### 7. Executar aplicações web e mobile

Os comandos específicos de Angular e Expo serão adicionados após a inicialização de cada aplicação.
