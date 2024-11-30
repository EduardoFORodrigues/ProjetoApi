---
# Projeto Fullstack: Mobile (Expo) + Backend (Node.js)

Este projeto é composto por duas partes principais:

1. **Mobile**: Desenvolvido utilizando o Expo para criar uma aplicação mobile.
2. **Backend**: Desenvolvido em Node.js para gerenciar a lógica do servidor e APIs.
---

## Pré-requisitos

Certifique-se de que você possui os seguintes programas instalados em sua máquina:

- [Node.js](https://nodejs.org/) (Recomenda-se a versão LTS mais recente)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) para gerenciar pacotes
- [Expo CLI](https://docs.expo.dev/get-started/installation/) para executar o projeto mobile
- Um emulador ou dispositivo físico para rodar o aplicativo mobile

---

## Instruções para rodar o projeto

### 1. Configuração inicial

1. Clone este repositório:
2. Navegue até a pasta do projeto:
   ```bash
   cd <NOME_DA_PASTA>
   ```

### 2. Rodando o Backend

1. Acesse a pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm run start
   ```

O servidor estará rodando no endereço: `http://localhost:3000` (ou a porta configurada no projeto).

### 3. Rodando o Mobile

1. Acesse a pasta `mobile`:
   ```bash
   cd ../mobile
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o Expo:
   ```bash
   npm run start
   ```
4. Siga as instruções apresentadas pelo Expo para rodar o aplicativo em um emulador ou dispositivo físico:
   - Escaneie o QR Code com o aplicativo Expo Go (iOS/Android).
   - Ou escolha rodar em um emulador conectado.

---

## Estrutura do Projeto

```
/backend      # Código do backend em Node.js
/mobile       # Código da aplicação mobile usando Expo
```

---

## Tecnologias Utilizadas

- **Backend**:

  - Node.js
  - Express.js
  - Outras dependências configuradas no `package.json`

- **Mobile**:
  - React Native
  - Expo
  - Outras dependências configuradas no `package.json`

---
