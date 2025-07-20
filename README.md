# Guia de Execução do Projeto

Este guia explica como configurar e rodar o projeto em sua máquina local.

Requisitos

- Node.js (v18+)
- PostgreSQL (com banco criado e credenciais configuradas)
- .NET 8 SDK

Passos para Rodar

1. Clone o Repositório

git clone https://github.com/ViniCarvalho71/Vendinha-interfocus
cd Vendinha-interfocus
cd VendinhaAPI

2. Configurar o Banco de Dados

Certifique-se de que o PostgreSQL esteja rodando e atualizado com os dados do `appsettings.json`:

"ConnectionStrings": {
  "Default": "Server=localhost;Port=5432;Database=postgres;User Id=postgres;Password=1234"
}

3. Restaurar Dependências

dotnet restore

5. Rodar o Backend

dotnet run

6. Rodar o Frontend 

cd VendinhaFront
npm install
npm run dev

# Bibliotecas extras utilizadas

- react-icons
- react-router-dom


📘 Documentação da API
# 📘 Documentação da API

## 🔹 Cliente

### ✅ Criar Cliente
- **Método:** `POST`
- **Rota:** `/api/cliente`
- **Descrição:** Cria um novo cliente.
- **Body esperado (JSON):**
```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01"
}
```

### 📥 Listar Clientes
- **Método:** `GET`
- **Rota:** `/api/cliente`
- **Descrição:** Retorna todos os clientes cadastrados.

### ✏️ Atualizar Cliente
- **Método:** `PUT`
- **Rota:** `/api/cliente`
- **Descrição:** Atualiza os dados de um cliente existente.
- **Body esperado (JSON):**
```json
{
  "id": 1,
  "nome": "João Silva Atualizado",
  "cpf": "123.456.789-00",
  "email": "joao.novo@email.com",
  "dataNascimento": "1990-01-01"
}
```

### ❌ Excluir Cliente
- **Método:** `DELETE`
- **Rota:** `/api/cliente/{codigo}`
- **Descrição:** Exclui o cliente com base no código (ID).
- **Parâmetro:** `codigo` (int) — ID do cliente a ser excluído.

---

## 🔸 Dívida

### ✅ Criar Dívida
- **Método:** `POST`
- **Rota:** `/api/divida`
- **Descrição:** Registra uma nova dívida para um cliente.
- **Body esperado (JSON):**
```json
{
  "descricao": "Compra no cartão",
  "valor": 150.00,
  "dataPagamento": "2025-08-01",
  "cliente": {
    "id": 1
  }
}
```

### 📥 Listar Dívidas
- **Método:** `GET`
- **Rota:** `/api/divida`
- **Descrição:** Retorna todas as dívidas registradas.

### ✏️ Atualizar Dívida
- **Método:** `PUT`
- **Rota:** `/api/divida`
- **Descrição:** Atualiza os dados de uma dívida.
- **Body esperado (JSON):**
```json
{
  "id": 2,
  "descricao": "Compra no mercado",
  "valor": 180.00,
  "dataPagamento": "2025-08-10",
  "cliente": {
    "id": 1
  },
  "situacao": false
}
```

### ❌ Excluir Dívida
- **Método:** `DELETE`
- **Rota:** `/api/divida/{codigo}`
- **Descrição:** Remove a dívida especificada.
- **Parâmetro:** `codigo` (int) — ID da dívida a ser removida.

### 📊 Total de Dívidas
- **Método:** `GET`
- **Rota:** `/api/divida/totalDividas`
- **Descrição:** Retorna o total de dívidas cadastradas (soma dos valores ou quantidade, dependendo da lógica implementada no back-end).
