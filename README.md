# 🎯 Roleta Teams - Sorteio de Participantes

Aplicação web para sortear participantes de reuniões do Microsoft Teams usando uma roleta animada.

## 🚀 Como usar

### Modo rápido (sem integração Teams)

1. Rode o servidor:
   ```bash
   node server.js
   ```
2. Acesse `http://localhost:3000`
3. Clique em "Inserir nomes manualmente"
4. Digite os nomes e gire a roleta!

### Modo Teams (integração automática)

Para pegar automaticamente os participantes da reunião:

#### 1. Registrar App no Azure AD

1. Acesse [portal.azure.com](https://portal.azure.com)
2. Vá em **Azure Active Directory** > **App registrations** > **New registration**
3. Configure:
   - **Nome:** Roleta Teams Sorteio
   - **Supported account types:** Accounts in any organizational directory
   - **Redirect URI:** Selecione "Single-page application (SPA)" e coloque `http://localhost:3000`
4. Clique em **Register**

#### 2. Configurar Permissões

1. No app registrado, vá em **API permissions** > **Add a permission**
2. Selecione **Microsoft Graph** > **Delegated permissions**
3. Adicione:
   - `User.Read`
   - `Calendars.Read`
   - `OnlineMeetings.Read`
4. Clique em **Grant admin consent** (ou peça ao admin)

#### 3. Copiar o Client ID

1. Na página **Overview** do app, copie o **Application (client) ID**
2. Abra o arquivo `auth.js`
3. Substitua `'SEU_CLIENT_ID_AQUI'` pelo ID copiado

#### 4. Usar!

1. `node server.js`
2. Acesse `http://localhost:3000`
3. Clique em "Entrar com Microsoft"
4. Os participantes da reunião em andamento serão carregados automaticamente
5. Selecione quem participa do sorteio e gire!

## 🎨 Funcionalidades

- ✅ Roleta visual animada com nomes
- ✅ Integração com Microsoft Teams (busca participantes automaticamente)
- ✅ Modo manual (para usar sem Teams)
- ✅ Remover sorteado da roleta
- ✅ Reiniciar sorteio
- ✅ Efeito de confete ao sortear
- ✅ Design responsivo (funciona no celular)
- ✅ Cores vibrantes automáticas por participante

## 📋 Requisitos

- Node.js (para o servidor local)
- Navegador moderno
- Conta Microsoft 365 (para integração Teams)

## 🔧 Estrutura

```
├── index.html      # Página principal
├── styles.css      # Estilos e animações
├── auth.js         # Autenticação Microsoft (MSAL)
├── roulette.js     # Motor da roleta (Canvas)
├── app.js          # Lógica da aplicação
├── server.js       # Servidor local
└── README.md       # Este arquivo
```
