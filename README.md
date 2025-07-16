# Vendinha Interfocus

Sistema web para gerenciamento de dívidas e clientes, com backend em ASP.NET Core (.NET 8), NHibernate e PostgreSQL, e frontend em React com Vite.

---

## Tecnologias

### Backend

- .NET 8 (ASP.NET Core)
- NHibernate (ORM)
- PostgreSQL (Banco de dados)
- Npgsql (driver PostgreSQL para .NET)
- Swashbuckle (Swagger UI para documentação da API)

### Frontend

- React 19
- Vite (bundler e dev server)
- React Router DOM (roteamento SPA)
- React Icons (ícones)
- ESLint (análise estática)

---

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js (>=16)](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

---

## Configuração do Banco de Dados

1. Instale o PostgreSQL e crie um banco (exemplo: `vendinha`).

2. Atualize o arquivo `appsettings.json` com sua conexão:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Port=5432;Database=vendinha;User Id=seu_usuario;Password=sua_senha"
  }
}
```

> Substitua `seu_usuario` e `sua_senha` pelos seus dados reais.

---

## Rodando o Backend

1. Clone o repositório:

```bash
git clone https://github.com/ViniCarvalho71/Vendinha-interfocus.git
cd Vendinha-interfocus
```

2. Restaure pacotes e compile o projeto:

```bash
dotnet restore
dotnet build
```

3. Execute a aplicação:

```bash
dotnet run
```

4. A API estará disponível em `https://localhost:5230`.

5. Para acessar a documentação Swagger:

```
https://localhost:5001/swagger
```

---

## Rodando o Frontend

1. Acesse a pasta do frontend (supondo que seja `vendinhafront` dentro do projeto):

```bash
cd vendinhafront
```

2. Instale dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra no navegador:

```
http://localhost:5137
```

---


## Estrutura do Projeto

```
/Vendinha-interfocus
|-- /vendinhafront    # Frontend React + Vite
|-- /Mapeamentos      # Arquivos NHibernate .hbm.xml
|-- hibernate.cfg.xml # Configuração NHibernate
|-- Program.cs        # Configuração do ASP.NET Core
|-- appsettings.json  # Configuração de conexão e logging
|-- Vendinha.csproj   # Projeto backend
```

---

## Contato

Para dúvidas ou contribuições, abra uma issue ou entre em contato com o autor.

---
