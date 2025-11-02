# Implementação de Gerenciamento de Goals (Metas)

## Resumo
Foi implementada a funcionalidade completa para o PM (Project Manager) gerenciar goals (metas) de mentorships, incluindo criar, editar, deletar e listar goals. Os goals criados aparecem tanto para o PM quanto para o Mentor.

## Alterações Realizadas

### 1. Backend - Firestore Service (`src/services/firestoreService.js`)
✅ Adicionada coleção `GOALS` às constantes
✅ Implementadas 4 funções CRUD:
- `createGoal(goalData)` - Cria um novo goal
- `getGoalsByMentorship(mentorshipId)` - Lista todos os goals de um mentorship
- `updateGoal(goalId, updates)` - Atualiza um goal existente
- `deleteGoal(goalId)` - Marca um goal como deletado (soft delete)

### 2. Regras de Segurança do Firestore (`firestore.rules`)
✅ Adicionadas regras para a coleção `goals`:
- Usuários autenticados podem ler goals
- Usuários autenticados podem criar goals (requer `mentorshipId`)
- Usuários autenticados podem atualizar goals
- Usuários autenticados podem deletar goals

### 3. Componente Principal (`src/pages/MentorshipDetails.jsx`)
✅ Adicionado import das funções de goals do Firestore
✅ Adicionado estado `loadingGoals` para controlar carregamento
✅ Implementado `useEffect` para buscar goals ao carregar o mentorship
✅ Modificado `handleGoalSubmit` para:
  - Criar novos goals no Firestore
  - Atualizar goals existentes
  - Deletar goals removidos
  - Recarregar goals após salvar

### 4. View do PM (`src/pages/mentorship-views/PMView.jsx`)
✅ Atualizado para usar os goals do Firestore via props `customGoals`
✅ Implementada atualização dinâmica dos valores atuais dos goals baseados nos dados do mentorship
✅ Goals padrão continuam sendo mostrados se nenhum goal customizado existir
✅ Botão "Manage Goals" abre o wizard para gerenciar goals

### 5. View do Mentor (`src/pages/mentorship-views/MentorView.jsx`)
✅ Já estava preparado para receber goals via props `customGoals`
✅ Exibe os mesmos goals que o PM criou
✅ Goals são read-only para o mentor (apenas visualização)

### 6. Goal Wizard (`src/components/GoalWizard.jsx`)
✅ Já estava implementado e funcional
✅ Permite criar, editar e deletar goals localmente
✅ Ao salvar, chama `onSubmit` que agora persiste no Firestore
✅ **Melhorias adicionadas:**
  - **Contagem correta de goals:** Agora inicia com array vazio ao invés de goals padrão
  - **Sincronização automática:** Usa `useEffect` para sincronizar com `initialGoals` quando o modal abre
  - **"Current Goals"** mostra a quantidade real de goals customizados salvos
  - **Estado vazio permitido:** PM pode salvar sem goals para usar os padrão
  - **Mensagens contextuais:**
    - Quando não há goals: "No Custom Goals Yet" com explicação sobre goals padrão
    - No review: mensagem diferente para estado com/sem goals
    - Botão continuar muda texto: "Review & Save" ou "Save (Use Defaults)"

## Fluxo de Funcionamento

### Para o PM (Project Manager):

1. **Visualizar Goals:**
   - Acessa a página de detalhes do mentorship
   - Goals são carregados automaticamente do Firestore
   - Se não houver goals customizados, mostra 4 goals padrão
   - **"Current Goals: X"** mostra a quantidade correta de goals salvos

2. **Criar Novo Goal:**
   - Clica no botão "Manage Goals"
   - Vê "Current Goals: 0" se não houver goals customizados
   - Clica em "Add New Goal" (ou no botão "Add Your First Goal" se vazio)
   - Preenche: nome, descrição, valor atual, valor alvo, unidade, cor
   - Clica em "Add Goal" e depois "Review & Save"
   - Goal é salvo no Firestore com `mentorshipId`

3. **Editar Goal:**
   - Clica no botão "Manage Goals"
   - Clica no ícone de editar (lápis) no goal desejado
   - Modifica os campos necessários
   - Clica em "Update Goal" e depois "Review & Save"
   - Goal é atualizado no Firestore

4. **Deletar Goal:**
   - Clica no botão "Manage Goals"
   - Clica no ícone de deletar (lixeira) no goal desejado
   - Confirma a exclusão
   - Clica em "Review & Save"
   - Goal é marcado como deletado no Firestore

5. **Usar Goals Padrão:**
   - Clica no botão "Manage Goals"
   - Vê que não há goals customizados
   - Clica em "Save (Use Defaults)" sem adicionar nenhum goal
   - Sistema usa os 4 goals padrão

### Para o Mentor:

1. **Visualizar Goals:**
   - Acessa a página de detalhes do mentorship
   - Vê os mesmos goals que o PM criou
   - Goals são read-only (não pode editar)
   - Valores atuais são atualizados automaticamente baseados no progresso do mentorship

## Estrutura de Dados

### Goal no Firestore:
```javascript
{
  id: "auto-generated-id",
  mentorshipId: "mentorship-id",
  name: "Nome do Goal",
  description: "Descrição do goal",
  current: 0,              // Valor atual
  target: 10,              // Valor alvo
  variant: "blue",         // Cor (blue, green, purple, orange, pink, yellow)
  unit: "%",               // Unidade opcional (%, /5, hrs, etc)
  deleted: false,          // Flag para soft delete
  createdAt: Timestamp,
  updatedAt: Timestamp,
  deletedAt: Timestamp     // Se deletado
}
```

## Goals Padrão

Se o PM não criar goals customizados, são exibidos 4 goals padrão:
1. **Total Sessions** (Azul) - Sessões completadas
2. **Overall Progress** (Verde) - Progresso geral em %
3. **Duration** (Roxo) - Duração em semanas
4. **Avg Rating** (Laranja) - Avaliação média

## Interface do Goal Wizard

### Tela 1 - Lista de Goals
- Mostra "Current Goals: X" com a quantidade de goals customizados
- Se vazio: mensagem explicativa + botão "Add Your First Goal"
- Se com goals: grid de cards com botões editar/deletar
- Botão "Add New Goal" no canto superior direito
- Botão inferior: "Review & Save" (com goals) ou "Save (Use Defaults)" (sem goals)

### Tela 2 - Formulário de Goal
- Campos: Nome, Descrição, Valor Atual, Valor Alvo, Unidade, Cor
- Validação: Nome e Valor Alvo são obrigatórios
- Botão: "Add Goal" (novo) ou "Update Goal" (edição)

### Tela 3 - Review
- Banner verde: "Goals Configured" (com goals customizados)
- Banner azul: "Using Default Goals" (sem goals customizados)
- Grid com preview de todos os goals customizados
- Botão "Save Goals" para confirmar

## Testes Recomendados

### Teste 1: Verificar Contagem de Goals
1. Login como PM
2. Acesse um mentorship sem goals customizados
3. Clique em "Manage Goals"
4. **Verificar:** "Current Goals: 0"
5. Adicione 2 goals
6. **Verificar:** "Current Goals: 2"

### Teste 2: Criar Goals como PM
1. Login como PM
2. Acesse um mentorship que você gerencia
3. Clique em "Manage Goals"
4. Adicione 2-3 goals customizados
5. Salve e verifique se aparecem na página

### Teste 3: Editar Goals como PM
1. Clique em "Manage Goals"
2. Edite um goal existente
3. Salve e verifique as mudanças

### Teste 4: Deletar Goals como PM
1. Clique em "Manage Goals"
2. Delete um goal
3. Salve e verifique que foi removido

### Teste 5: Visualizar Goals como Mentor
1. Login como Mentor
2. Acesse o mesmo mentorship
3. Verifique se os goals criados pelo PM aparecem
4. Verifique que não há opção de editar

### Teste 6: Usar Goals Padrão
1. Login como PM
2. Acesse um mentorship sem goals
3. Clique em "Manage Goals"
4. Clique em "Save (Use Defaults)" sem adicionar goals
5. Verifique que os 4 goals padrão aparecem

### Teste 7: Persistência
1. Crie goals como PM
2. Faça logout e login novamente
3. Verifique se os goals foram mantidos
4. Recarregue a página
5. Verifique que "Current Goals" mostra o número correto

## Notas Técnicas

- **Soft Delete:** Goals não são deletados permanentemente, apenas marcados como `deleted: true`
- **Valores Dinâmicos:** Os valores atuais dos goals são atualizados automaticamente baseados nos dados do mentorship
- **Validação:** Goals requerem nome e valor alvo para serem salvos
- **Segurança:** Apenas usuários autenticados podem gerenciar goals
- **Performance:** Goals são carregados uma vez ao abrir a página do mentorship
- **Sincronização:** useEffect garante que o wizard sempre mostra os goals mais recentes
- **Estado Vazio:** PM pode salvar sem goals para voltar aos goals padrão
- **Contagem Precisa:** "Current Goals" mostra apenas goals customizados salvos no Firestore

## Próximos Passos (Opcional)

- [ ] Adicionar permissões mais granulares (apenas PM e Mentor do mentorship podem ver goals)
- [ ] Implementar histórico de alterações de goals
- [ ] Adicionar gráficos de progresso dos goals ao longo do tempo
- [ ] Permitir que o Mentor sugira goals ao PM
- [ ] Adicionar notificações quando goals são atingidos
- [ ] Adicionar templates de goals (conjuntos pré-definidos para diferentes tipos de mentorship)

