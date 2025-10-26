# 🚀 Quickstart Guide - Mentorship CoPilot

## Primeiros Passos

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

#### Opção A: Usar Emuladores Locais (Recomendado para Desenvolvimento)

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Fazer login no Firebase
firebase login

# Iniciar emuladores
npm run emulators
```

Em outro terminal:
```bash
# Iniciar aplicação
npm run dev
```

**URLs:**
- App: http://localhost:5173
- Emulator UI: http://localhost:4000
- Auth Emulator: http://localhost:9099
- Firestore Emulator: http://localhost:8080

#### Opção B: Usar Firebase em Produção

1. Criar projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ativar **Authentication** (Email/Password e Google)
3. Ativar **Firestore Database**
4. Copiar credenciais para arquivo `.env`:

```bash
cp .env.example .env
# Editar .env com suas credenciais
```

5. Iniciar aplicação:
```bash
npm run dev
```

## 🎯 Fluxo de Uso

### 1. Criar Conta
- Acesse `/register`
- Escolha entre:
  - Email e senha
  - Login com Google

### 2. Completar Onboarding
Após registro, você será redirecionado para o onboarding (`/onboarding`):

**Para Mentores/PMs:**
1. Nome
2. Biografia
3. Tipo de usuário (Mentor/PM)
4. Selecionar tecnologias
5. Avaliar nível de conhecimento (1-5 estrelas)

**Para Mentorados:**
1. Nome
2. Biografia
3. Tipo de usuário (Mentorado)
4. Projeto atual (opcional)
5. Tecnologias que usa

### 3. Acessar Dashboard
Após completar o onboarding, você terá acesso ao dashboard com:
- **Your Insights**: Estatísticas pessoais
- **Magic Suggestions**: Sugestões de mentores/mentorados baseadas em IA
- **Upcoming Sessions**: Próximas sessões agendadas
- **AI Opportunities**: Oportunidades de crescimento

## 🧪 Testando Localmente com Emuladores

### Criar Usuários de Teste

1. Acesse o Emulator UI: http://localhost:4000
2. Vá em **Authentication**
3. Adicione usuários de teste
4. Ou registre-se pela aplicação

### Visualizar Dados no Firestore

1. Acesse o Emulator UI: http://localhost:4000
2. Vá em **Firestore**
3. Veja as collections: `users`, `mentorships`, `sessions`, `activities`

### Exportar/Importar Dados dos Emuladores

```bash
# Exportar dados atuais
npm run emulators:export

# Importar dados salvos
npm run emulators:import
```

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── firebase.js              # Configuração do Firebase
├── services/
│   ├── authService.js           # Serviço de autenticação
│   └── firestoreService.js      # Serviço do Firestore
├── contexts/
│   └── AuthContext.jsx          # Context de autenticação
├── components/
│   ├── ProtectedRoute.jsx       # Proteção de rotas
│   ├── EmptyState.jsx           # Estados vazios
│   ├── Sidebar.jsx              # Sidebar com logout
│   └── ...                      # Outros componentes
├── pages/
│   ├── Login.jsx                # Página de login
│   ├── Register.jsx             # Página de registro
│   ├── Onboarding.jsx           # Wizard de onboarding
│   ├── Dashboard.jsx            # Dashboard com dados reais
│   └── ...                      # Outras páginas
└── App.jsx                      # Rotas e AuthProvider
```

## 🔐 Autenticação

### Usar o Hook useAuth

```jsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { 
    user,              // Dados do usuário atual
    loading,           // Estado de carregamento
    login,             // Função de login
    logout,            // Função de logout
    isAuthenticated,   // Está autenticado?
    needsOnboarding    // Precisa completar onboarding?
  } = useAuth()

  if (loading) return <div>Carregando...</div>
  if (!isAuthenticated) return <div>Não autenticado</div>

  return <div>Olá, {user.displayName}!</div>
}
```

## 🗄️ Firestore

### Usar os Serviços do Firestore

```jsx
import { 
  getUserProfile,
  getMentors,
  getSmartSuggestions,
  createMentorship
} from '../services/firestoreService'

// Buscar perfil do usuário
const profile = await getUserProfile(userId)

// Buscar mentores
const mentors = await getMentors({ technologies: ['React', 'Node.js'] })

// Buscar sugestões inteligentes
const suggestions = await getSmartSuggestions(userId)

// Criar mentoria
const mentorship = await createMentorship({
  mentorId: 'mentor-uid',
  menteeId: 'mentee-uid',
  topic: 'React Development'
})
```

## 🎨 Componentes UI

### Usar Empty States

```jsx
import EmptyState from '../components/EmptyState'
import { Users } from 'lucide-react'
import Button from '../components/Button'

{items.length === 0 ? (
  <EmptyState 
    icon={Users}
    title="Nenhum resultado"
    description="Ainda não há dados para exibir"
    action={
      <Button variant="orange" onClick={handleAction}>
        Adicionar Item
      </Button>
    }
  />
) : (
  // Renderizar items
)}
```

## 🚀 Deploy

### Deploy para Firebase Hosting

```bash
# Build e deploy
npm run firebase:deploy

# Ou manualmente
npm run build
firebase deploy
```

## 📝 Checklist de Desenvolvimento

### Antes de começar:
- [x] Firebase CLI instalado
- [x] Dependências instaladas (`npm install`)
- [x] Arquivo `.env` configurado (se não usar emuladores)
- [x] Emuladores rodando (`npm run emulators`)
- [x] App rodando (`npm run dev`)

### Para produção:
- [ ] Criar projeto no Firebase Console
- [ ] Ativar Authentication (Email/Password e Google)
- [ ] Ativar Firestore
- [ ] Configurar domínio personalizado (opcional)
- [ ] Fazer deploy (`npm run firebase:deploy`)
- [ ] Testar em produção

## 🐛 Troubleshooting

### Emuladores não iniciam
```bash
# Verificar se as portas estão disponíveis
lsof -i :9099  # Auth
lsof -i :8080  # Firestore
lsof -i :4000  # UI

# Ou no Windows
netstat -ano | findstr :9099
```

### Erro de autenticação
- Verificar se o Authentication está ativado no Firebase Console
- Verificar se os provedores estão habilitados
- Limpar cache e cookies do navegador

### Dados não aparecem
- Verificar se o usuário completou o onboarding
- Abrir Emulator UI e verificar se os dados estão no Firestore
- Verificar as regras de segurança (`firestore.rules`)

## 📚 Documentação Adicional

- [README_AUTH.md](./README_AUTH.md) - Documentação completa de autenticação
- [Firebase Docs](https://firebase.google.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## 🤝 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do terminal onde o app está rodando
3. Verifique o Emulator UI para dados do Firestore
4. Consulte a documentação do Firebase

---

**Pronto para começar! 🎉**

Execute `npm run emulators` em um terminal e `npm run dev` em outro, depois acesse http://localhost:5173

