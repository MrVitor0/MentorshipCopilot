# 🛠️ Instruções de Setup - Mentorship CoPilot

## 🚀 Setup Rápido (5 minutos)

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### Passo 3: Login no Firebase
```bash
firebase login
```

### Passo 4: Iniciar Emuladores
```bash
firebase emulators:start
```

### Passo 5: Iniciar App (em outro terminal)
```bash
npm run dev
```

✅ **Pronto!** Acesse http://localhost:5173

---

## 📋 Setup Completo

### 1. Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn
- Conta Google (para Firebase Console)
- Git (opcional)

### 2. Clone e Instale

```bash
# Clone o repositório (se aplicável)
git clone <repo-url>
cd MentorshipCopilot

# Instale dependências
npm install

# Instale Firebase CLI globalmente
npm install -g firebase-tools
```

### 3. Configurar Firebase

#### Opção A: Desenvolvimento com Emuladores (Recomendado)

```bash
# Login no Firebase
firebase login

# Verificar projeto
firebase projects:list

# Iniciar emuladores
firebase emulators:start
```

**Emuladores disponíveis em:**
- Auth: http://127.0.0.1:9099
- Firestore: http://127.0.0.1:8080
- UI: http://127.0.0.1:4000

#### Opção B: Usar Firebase em Produção

1. **Criar Projeto no Firebase Console**
   - Acesse https://console.firebase.google.com/
   - Crie um novo projeto
   - Anote o Project ID

2. **Ativar Services**
   - Authentication → Enable
     - Email/Password → Enable
     - Google → Enable
   - Firestore Database → Create Database
     - Modo: Test mode (para desenvolvimento)
     - Location: us-central1

3. **Obter Credenciais**
   - Project Settings → General
   - Your apps → Web app
   - Copy config object

4. **Configurar .env**
   ```bash
   cp .env.example .env
   ```
   
   Edite `.env` com suas credenciais:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto
   VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### 4. Iniciar Aplicação

```bash
# Desenvolvimento com emuladores
npm run dev

# Ou com emuladores + app em um comando
npm run dev:full
```

Acesse: http://localhost:5173

### 5. Verificar Setup

1. **Abrir App** - http://localhost:5173
2. **Abrir Emulator UI** - http://localhost:4000
3. **Criar conta de teste**
4. **Completar onboarding**
5. **Verificar dados no Firestore** (Emulator UI)

---

## 🗄️ Estrutura de Dados

### Collections Criadas Automaticamente

Ao usar a aplicação, as seguintes collections serão criadas:

#### 1. users
```javascript
{
  uid: "firebase-auth-uid",
  email: "user@example.com",
  displayName: "Nome do Usuário",
  photoURL: "https://...",
  bio: "Descrição do perfil",
  userType: "mentor | pm | mentee",
  technologies: [
    { name: "React", level: 4 },
    { name: "Node.js", level: 5 }
  ],
  project: "Nome do Projeto", // apenas mentorados
  onboardingCompleted: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. mentorships
```javascript
{
  id: "auto-generated",
  mentorId: "uid-do-mentor",
  menteeId: "uid-do-mentorado",
  status: "active | completed | cancelled",
  topic: "Tema da mentoria",
  goals: ["Objetivo 1", "Objetivo 2"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 3. sessions
```javascript
{
  id: "auto-generated",
  mentorshipId: "id-da-mentoria",
  participantIds: ["uid1", "uid2"],
  scheduledDate: Timestamp,
  duration: 60, // minutos
  status: "scheduled | completed | cancelled",
  notes: "Notas da sessão",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 4. activities
```javascript
{
  id: "auto-generated",
  userId: "uid-do-usuario",
  action: "mentorship_created | session_completed",
  description: "Descrição da ação",
  metadata: {},
  createdAt: Timestamp
}
```

---

## 🔐 Regras de Segurança

As regras do Firestore estão em `firestore.rules` e incluem:

- ✅ Usuários autenticados podem ler perfis
- ✅ Usuários só editam seu próprio perfil
- ✅ Mentorias visíveis apenas aos participantes
- ✅ Sessões visíveis apenas aos participantes

**Deploy das regras:**
```bash
firebase deploy --only firestore:rules
```

---

## 📱 Testando o Fluxo Completo

### 1. Registro
1. Acesse http://localhost:5173
2. Clique em "Criar conta"
3. Escolha entre:
   - Email e senha
   - Google (funciona no emulator!)

### 2. Onboarding - Mentor
1. **Passo 1**: Digite seu nome completo
2. **Passo 2**: Escreva sua bio
3. **Passo 3**: Selecione "Mentor" ou "PM"
4. **Passo 4**: Selecione tecnologias (React, Node.js, etc)
5. **Passo 5**: Avalie seu nível (1-5 estrelas)
6. Clique em "Finalizar"

### 3. Onboarding - Mentorado
1. **Passo 1**: Digite seu nome completo
2. **Passo 2**: Escreva sua bio
3. **Passo 3**: Selecione "Mentorado"
4. **Passo 4**: Digite projeto atual (opcional) e selecione tecnologias
5. Clique em "Finalizar"

### 4. Dashboard
- Veja suas estatísticas
- Explore sugestões de mentores/mentorados
- Confira sessões agendadas

### 5. Verificar Dados
1. Abra http://localhost:4000
2. Vá em "Firestore"
3. Veja collection "users"
4. Confirme que seus dados estão lá

---

## 🧪 Dados de Teste

### Criar Múltiplos Usuários

Para testar matching e sugestões, crie vários usuários:

1. **Mentor de React**
   - Nome: João Silva
   - Tipo: Mentor
   - Tecnologias: React, TypeScript, Node.js

2. **Mentor de Python**
   - Nome: Maria Santos
   - Tipo: Mentor
   - Tecnologias: Python, Django, PostgreSQL

3. **Mentorado**
   - Nome: Pedro Costa
   - Tipo: Mentorado
   - Tecnologias: React, JavaScript

### Exportar/Importar Dados

```bash
# Exportar dados dos emuladores
firebase emulators:export ./firebase-data

# Importar dados salvos
firebase emulators:start --import=./firebase-data
```

---

## 🐛 Troubleshooting

### Problema: Emuladores não iniciam

**Erro: "Port already in use"**
```bash
# Windows
netstat -ano | findstr :9099
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:9099 | xargs kill -9
```

### Problema: Erro de autenticação

**Solução:**
1. Limpe cache do navegador
2. Verifique Emulator UI → Authentication
3. Reinicie emuladores

### Problema: Dados não aparecem

**Soluções:**
1. Verifique console do navegador (F12)
2. Abra Emulator UI → Firestore
3. Confirme que regras estão corretas
4. Verifique se usuário completou onboarding

### Problema: "Module not found"

```bash
# Reinstale dependências
rm -rf node_modules
npm install
```

### Problema: Erros de linting

```bash
npm run lint
```

---

## 🚀 Deploy para Produção

### 1. Build

```bash
npm run build
```

### 2. Configurar Firebase Project

```bash
firebase use --add
# Selecione seu projeto
```

### 3. Deploy

```bash
# Deploy completo (hosting + rules)
firebase deploy

# Ou apenas hosting
firebase deploy --only hosting

# Ou apenas rules
firebase deploy --only firestore:rules
```

### 4. Configurar Domínio (Opcional)

1. Firebase Console → Hosting
2. Add custom domain
3. Siga instruções DNS

---

## 📊 Monitoramento

### Firebase Console

Monitore:
- Authentication → Users
- Firestore → Data
- Hosting → Usage
- Performance → Metrics

### Logs

```bash
# Ver logs
firebase functions:log

# Ver logs em tempo real
firebase functions:log --only
```

---

## 🔒 Segurança em Produção

### Checklist

- [ ] Firestore rules em produção
- [ ] Domínios autorizados (OAuth)
- [ ] HTTPS habilitado
- [ ] API Keys restritas
- [ ] Backup de dados configurado
- [ ] Monitoring habilitado

### Configurar API Key Restrictions

1. Google Cloud Console
2. APIs & Services → Credentials
3. Selecione API Key
4. Application restrictions → HTTP referrers
5. Adicione seu domínio

---

## 📝 Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar app
npm run emulators        # Iniciar emuladores

# Build
npm run build           # Build para produção
npm run preview         # Preview da build

# Linting
npm run lint            # Verificar erros

# Firebase
npm run firebase:deploy # Build + Deploy
```

---

## 📚 Recursos Adicionais

### Documentação
- [Firebase Docs](https://firebase.google.com/docs)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

### Arquivos de Referência
- `README_AUTH.md` - Documentação de autenticação
- `QUICKSTART.md` - Guia rápido
- `IMPLEMENTATION_SUMMARY.md` - Resumo da implementação

---

## ❓ Precisa de Ajuda?

1. Verifique console do navegador (F12)
2. Consulte Emulator UI logs
3. Leia documentação do Firebase
4. Verifique este arquivo

---

**🎉 Pronto para começar!**

Execute:
```bash
firebase emulators:start
```

Em outro terminal:
```bash
npm run dev
```

Acesse: http://localhost:5173

