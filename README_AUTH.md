# Sistema de Autenticação e Firebase

Este documento descreve o sistema de autenticação implementado no Mentorship CoPilot.

## 🔥 Firebase Setup

### 1. Configuração Inicial

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative **Authentication** com os seguintes provedores:
   - Email/Password
   - Google
3. Ative **Firestore Database** em modo de teste
4. Copie as credenciais do Firebase

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Preencha com suas credenciais do Firebase.

### 3. Emuladores Locais (Desenvolvimento)

Para desenvolvimento local, use os emuladores do Firebase:

```bash
# Instalar Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# Fazer login no Firebase
firebase login

# Iniciar os emuladores
firebase emulators:start
```

Os emuladores estarão disponíveis em:
- **Auth Emulator**: http://127.0.0.1:9099
- **Firestore Emulator**: http://127.0.0.1:8080
- **Emulator UI**: http://127.0.0.1:4000

## 📚 Estrutura do Firestore

### Collections

#### `users`
```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,            // Email do usuário
  displayName: string,      // Nome completo
  photoURL: string?,        // URL da foto (opcional)
  bio: string,              // Descrição do perfil
  userType: string,         // 'mentor' | 'pm' | 'mentee'
  technologies: [           // Array de tecnologias
    {
      name: string,
      level: number         // 1-5 (apenas para mentores)
    }
  ],
  project: string?,         // Projeto atual (apenas mentorados)
  onboardingCompleted: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `mentorships`
```javascript
{
  id: string,
  mentorId: string,         // UID do mentor
  menteeId: string,         // UID do mentorado
  status: string,           // 'active' | 'completed' | 'cancelled'
  topic: string,            // Tema da mentoria
  goals: string[],          // Objetivos
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `sessions`
```javascript
{
  id: string,
  mentorshipId: string,     // Referência à mentoria
  participantIds: string[], // UIDs dos participantes
  scheduledDate: Timestamp, // Data agendada
  duration: number,         // Duração em minutos
  status: string,           // 'scheduled' | 'completed' | 'cancelled'
  notes: string?,           // Notas da sessão
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `activities`
```javascript
{
  id: string,
  userId: string,           // UID do usuário
  action: string,           // Tipo de ação
  description: string,      // Descrição
  metadata: object?,        // Dados adicionais
  createdAt: Timestamp
}
```

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Registro/Login**
   - `/register` - Criar conta com email/senha ou Google
   - `/login` - Fazer login

2. **Onboarding**
   - `/onboarding` - Wizard multi-step para completar perfil
   - Obrigatório após primeiro registro

3. **Dashboard**
   - `/dashboard` - Acesso apenas para usuários autenticados com onboarding completo

### Protected Routes

Todas as rotas protegidas usam o componente `<ProtectedRoute>`:
- Verifica se o usuário está autenticado
- Redireciona para `/login` se não autenticado
- Redireciona para `/onboarding` se onboarding não completo

### Contexto de Autenticação

Use o hook `useAuth()` para acessar:

```javascript
const { 
  user,              // Objeto do usuário atual
  loading,           // Estado de carregamento
  error,             // Erro de autenticação
  login,             // Função para login com email/senha
  loginWithGoogle,   // Função para login com Google
  register,          // Função para registro
  logout,            // Função para logout
  refreshUser,       // Função para atualizar dados do usuário
  isAuthenticated,   // Boolean: usuário está autenticado
  needsOnboarding    // Boolean: precisa completar onboarding
} = useAuth()
```

## 🛠️ Serviços

### AuthService
Gerencia todas as operações de autenticação:
- `registerWithEmail(email, password, displayName)`
- `signInWithEmail(email, password)`
- `signInWithGoogle()`
- `signOut()`
- `getCurrentUser()`
- `onAuthStateChange(callback)`

### FirestoreService
Gerencia todas as operações do Firestore:
- **Usuários**: `createUserProfile`, `getUserProfile`, `updateUserProfile`
- **Mentores**: `getMentors`, `getMentees`
- **Mentorias**: `createMentorship`, `getUserMentorships`
- **Sessões**: `createSession`, `getUpcomingSessions`
- **Atividades**: `createActivity`, `getRecentActivities`
- **AI**: `getSmartSuggestions`

## 🎨 UI/UX

### Páginas Implementadas

- **Login** (`/login`) - Design moderno com gradientes
- **Registro** (`/register`) - Formulário completo
- **Onboarding** (`/onboarding`) - Wizard de 4-5 passos
- **Dashboard** (`/dashboard`) - Com dados reais do Firestore

### Empty States

Todos os componentes têm tratamento para estados vazios:
- Magic Suggestions - quando não há sugestões
- Upcoming Sessions - quando não há sessões agendadas
- Usa o componente `<EmptyState>` com ícone, título, descrição e ação

## 🚀 Como Usar

### Desenvolvimento Local

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar Firebase**
   - Criar projeto no Firebase Console
   - Copiar credenciais para `.env`

3. **Iniciar emuladores**
```bash
firebase emulators:start
```

4. **Iniciar aplicação**
```bash
npm run dev
```

5. **Acessar**
   - App: http://localhost:5173
   - Emulator UI: http://localhost:4000

### Produção

1. **Build**
```bash
npm run build
```

2. **Deploy**
```bash
firebase deploy
```

## 📋 Regras de Segurança

As regras do Firestore estão configuradas em `firestore.rules`:

- ✅ Usuários autenticados podem ler perfis de outros usuários
- ✅ Usuários só podem criar/editar seu próprio perfil
- ✅ Mentorias só são acessíveis aos participantes
- ✅ Sessões só são acessíveis aos participantes
- ✅ Atividades são públicas para usuários autenticados

## 🔍 Troubleshooting

### Erro de conexão com emuladores

Se você ver erros de conexão, verifique:
1. Os emuladores estão rodando (`firebase emulators:start`)
2. As portas 9099, 8080 e 4000 estão disponíveis
3. O arquivo `firebase.json` está configurado corretamente

### Erro de autenticação

1. Verifique se as credenciais no `.env` estão corretas
2. Verifique se o Authentication está ativado no Firebase Console
3. Verifique se os provedores (Email/Password e Google) estão habilitados

### Dados não aparecem

1. Verifique se o usuário completou o onboarding
2. Verifique as regras do Firestore
3. Abra o Emulator UI para ver os dados no Firestore

## 📝 Próximos Passos

- [ ] Implementar recuperação de senha
- [ ] Adicionar verificação de email
- [ ] Implementar upload de foto de perfil
- [ ] Adicionar notificações em tempo real
- [ ] Implementar chat entre mentor e mentorado
- [ ] Adicionar filtros avançados de busca

