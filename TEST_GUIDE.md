# 🧪 Guia de Testes - Mentorship CoPilot

## 🎯 Como Testar as Três Versões de Dashboard

### Setup Inicial
```bash
# Terminal 1
firebase emulators:start

# Terminal 2
npm run dev
```

---

## 👨‍🏫 Testar como MENTOR

### 1. Criar Conta
1. Acesse http://localhost:5173
2. Click "Sign up"
3. Register com email: `mentor@test.com` / senha: `123456`

### 2. Onboarding (5 passos)
1. **Step 1**: Nome → "John Mentor"
2. **Step 2**: Bio → "Senior developer with 10 years of experience"
3. **Step 3**: Select **"Mentor"**
4. **Step 4**: Technologies (digite e pressione Enter):
   - `react` → vira "React"
   - `node.js` → vira "Node.Js"
   - `python` → vira "Python"
   - `aws` → vira "Aws"
5. **Step 5**: Rate cada tecnologia (1-5 stars)
   - React: ⭐⭐⭐⭐⭐ (Expert)
   - Node.js: ⭐⭐⭐⭐ (Advanced)
   - Python: ⭐⭐⭐ (Intermediate)
6. Click "Complete Setup"

### 3. Verificar Dashboard
✅ Título: **"Mentor Dashboard"**  
✅ Tema: **Orange/Laranja**  
✅ Botões visíveis:
   - Ask AI CoPilot ✅
   - New Mentorship ✅
   - Find Mentor ❌ (hidden)

✅ Cards visíveis:
   - Your Insights (4 stats)
   - What's Next (My Mentorships, Log Session)
   - Magic Suggestions
   - Smart Insights
   - Need Assistance (orange)
   - AI Opportunities
   - Upcoming Sessions

### 4. Testar Settings
1. Click avatar no sidebar
2. Click "Settings"
3. Edit name → "John Senior Mentor"
4. Edit bio
5. Add photo URL (optional)
6. Click "Save Changes"
7. ✅ Success message
8. ✅ Name updated in sidebar

---

## 👔 Testar como PRODUCT MANAGER

### 1. Criar Nova Conta
1. Logout (se logado)
2. Register com email: `pm@test.com` / senha: `123456`

### 2. Onboarding (3 passos apenas!)
1. **Step 1**: Nome → "Sarah Manager"
2. **Step 2**: Bio → "Product Manager leading innovative teams"
3. **Step 3**: Select **"Product Manager"**
4. ✅ Pronto! (sem tecnologias, sem níveis)
5. Click "Complete Setup"

### 3. Verificar Dashboard
✅ Título: **"Project Manager Dashboard"**  
✅ Tema: **Blue/Azul**  
✅ Botões visíveis:
   - Ask AI CoPilot ✅
   - Find Mentor ✅
   - New Mentorship ✅

✅ Cards visíveis:
   - Management Overview (4 stats)
   - Project Management (My Projects, Analytics)
   - Project Progress (com progress bars)
   - Action Required (purple card)
   - Action Items
   - Upcoming Sessions

✅ **Diferenças do Mentor:**
   - Stats: Projects, Completed, Reviews, Sessions
   - CTAs: My Projects, Analytics
   - Project Progress cards
   - Action Items ao invés de Magic Suggestions

---

## 🎓 Testar como MENTEE

### 1. Criar Nova Conta
1. Logout
2. Register com email: `mentee@test.com` / senha: `123456`

### 2. Onboarding (4 passos)
1. **Step 1**: Nome → "Mike Student"
2. **Step 2**: Bio → "Junior developer eager to learn"
3. **Step 3**: Select **"Mentee"**
4. **Step 4**: 
   - Current Project (opcional): "E-commerce Platform"
   - Technologies: `javascript`, `react`, `css`
5. Click "Complete Setup"

### 3. Verificar Dashboard
✅ Título: **"Learning Dashboard"**  
✅ Tema: **Purple/Roxo**  
✅ Botões visíveis:
   - Ask AI CoPilot ✅
   - Find Mentor ✅
   - New Mentorship ❌ (hidden)

✅ Cards ÚNICOS do Mentee:
   - **Learning Journey** (4 stats: Progress, Sessions, Hours, Performance)
   - **Current Mentorship Overview**
     - Progress bar (68%)
     - CTAs: View Details, Sessions
   - **Recommended Courses** ⭐ NOVO
     - 3 cursos da Udemy
     - Ratings, students count
     - Links clicáveis (abre Udemy)
     - Ícones: 🎓💻📘
   - **Support Materials** ⭐ NOVO
     - 4 PDFs coloridos
     - Ícones diferentes
     - Tamanhos de arquivo
     - Botão download
   - **Next Session** (se houver - card orange)
   - **All Sessions** list
   - **Your Progress** (3 stats coloridos)

### 4. Testar Links dos Cursos
1. Click em "Complete React Developer"
2. ✅ Abre Udemy em nova aba
3. Click em "Explore more courses on Udemy"
4. ✅ Abre página da Udemy

---

## 🔐 Testar Permissões

### Mentor não deve ver:
- ❌ Botão "Find Mentor" no header
- ❌ Tab "View as PM" (em MentorshipDetails - ainda não implementado)

### PM não deve ver:
- ❌ Tab "View as Mentor" (em MentorshipDetails - ainda não implementado)

### Mentee não deve ver:
- ❌ Botão "New Mentorship" no header
- ✅ Deve ver botão "Find Mentor"

---

## 🎨 Verificar Temas

### Cores por Dashboard:
- **Mentor**: Orange (`#F66135`)
- **PM**: Blue (`#1A73E8`)
- **Mentee**: Purple (`#A855F7`)

### Verificar elementos:
- Progress bars
- Stat cards
- CTAs
- Icons
- Badges

---

## 🔄 Testar Fluxos

### 1. Logout e Login
1. Logout via dropdown
2. ✅ Redirecionado para `/login`
3. Login novamente
4. ✅ Vai direto para dashboard correto

### 2. Settings
1. Profile dropdown → Settings
2. Edit profile
3. Save
4. ✅ Changes reflected immediately
5. Logout e login novamente
6. ✅ Changes persisted

### 3. Onboarding
1. Criar nova conta
2. Onboarding incompleto? → ✅ Redireciona para `/onboarding`
3. Completar onboarding
4. ✅ Vai para dashboard correto

### 4. Protected Routes
1. Logout
2. Tentar acessar `/dashboard` diretamente
3. ✅ Redireciona para `/login`
4. Login
5. ✅ Vai para `/dashboard`

---

## 🗄️ Verificar Firestore

### 1. Abrir Emulator UI
http://localhost:4000

### 2. Verificar Collections

#### Users Collection
```javascript
{
  uid: "firebase-uid",
  email: "mentor@test.com",
  displayName: "John Mentor",
  bio: "Senior developer...",
  userType: "mentor",
  technologies: [
    { name: "React", level: 5 },
    { name: "Node.Js", level: 4 },
    { name: "Python", level: 3 }
  ],
  onboardingCompleted: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### PM sem technologies
```javascript
{
  userType: "pm",
  // NO technologies array
  // NO project field
}
```

#### Mentee com project
```javascript
{
  userType: "mentee",
  technologies: [
    { name: "Javascript", level: 0 },
    { name: "React", level: 0 }
  ],
  project: "E-commerce Platform"
}
```

---

## ✅ Checklist de Testes

### Autenticação
- [ ] Register com email
- [ ] Register com Google
- [ ] Login com email
- [ ] Login com Google
- [ ] Logout
- [ ] Error messages em inglês

### Onboarding
- [ ] Mentor: 5 passos
- [ ] PM: 3 passos
- [ ] Mentee: 4 passos
- [ ] Free input de tecnologias
- [ ] Capitalização automática
- [ ] Rating de expertise
- [ ] Progress bar
- [ ] Validação de campos

### Dashboards
- [ ] Mentor: orange theme, CTAs corretos
- [ ] PM: blue theme, project management
- [ ] Mentee: purple theme, courses & materials
- [ ] Stats dinâmicos
- [ ] Empty states
- [ ] Loading states

### Permissões
- [ ] Botões condicionais
- [ ] Dashboards corretos por tipo
- [ ] Settings acessível para todos
- [ ] Find Mentor (só mentee/pm)
- [ ] New Mentorship (só mentor/pm)

### Settings
- [ ] Edit name
- [ ] Edit bio
- [ ] Edit photo URL
- [ ] Save changes
- [ ] Success message
- [ ] Cancel button
- [ ] Changes reflected

### UI/UX
- [ ] Dropdown no perfil
- [ ] Hover states
- [ ] Animações
- [ ] Responsivo
- [ ] Cores consistentes
- [ ] Gradientes suaves

---

## 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento! 🎉

Se encontrar algum bug:
1. Abra console do navegador (F12)
2. Verifique Emulator UI
3. Veja logs do terminal
4. Consulte documentação

---

## 🎉 Pronto para Testar!

Execute os emuladores e app, depois crie 3 contas diferentes (mentor, pm, mentee) para ver todas as versões do dashboard!

**Divirta-se testando!** 🚀

