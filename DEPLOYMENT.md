# 🚀 Deployment Guide - Mentorship CoPilot

Este guia explica como fazer o deploy seguro da aplicação para produção, incluindo a configuração de variáveis de ambiente sensíveis.

## 📋 Pré-requisitos

- Node.js 22+ instalado
- Firebase CLI instalado globalmente: `npm install -g firebase-tools`
- Conta Firebase com projeto criado
- Chave API da Anthropic (Claude) para recursos de AI

## 🔐 1. Configuração de Variáveis de Ambiente

### Frontend (.env)

As variáveis do frontend são buildadas no bundle e ficam públicas. Use apenas configurações não-sensíveis:

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais do Firebase Console
# Project Settings > General > Your apps > SDK setup and configuration
```

**⚠️ IMPORTANTE:** Nunca commite o arquivo `.env` no git!

### Backend/Functions (functions/.env)

O arquivo `functions/.env` contém secrets sensíveis e é usado apenas localmente para desenvolvimento.

```bash
# Copie o arquivo de exemplo
cp functions/.env.example functions/.env

# Edite com sua chave da Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

**⚠️ CRÍTICO:** Este arquivo NUNCA deve ir para o repositório e NÃO é usado em produção!

## 🔧 2. Configuração de Secrets no Firebase (Produção)

Para produção, use o Firebase Secret Manager para armazenar variáveis sensíveis de forma segura:

### Passo 1: Fazer login no Firebase
```bash
firebase login
```

### Passo 2: Selecionar o projeto
```bash
firebase use <your-project-id>
```

### Passo 3: Configurar o Secret da Anthropic
```bash
# Definir o secret (irá solicitar o valor)
firebase functions:secrets:set ANTHROPIC_API_KEY

# Ou definir diretamente
echo "sk-ant-api03-xxxxx" | firebase functions:secrets:set ANTHROPIC_API_KEY
```

### Passo 4: Verificar secrets configurados
```bash
firebase functions:secrets:access ANTHROPIC_API_KEY
```

### Passo 5: Dar acesso ao secret para as functions
```bash
# Listar secrets
firebase functions:secrets:list

# O secret será automaticamente disponibilizado quando você fizer deploy
```

## 🏗️ 3. Preparação para Deploy

### Atualizar código das Functions para usar Secrets

Certifique-se que suas functions estão configuradas para usar os secrets:

```typescript
// functions/src/index.ts
import { onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

// Define o secret
const anthropicApiKey = defineSecret('ANTHROPIC_API_KEY');

export const myFunction = onCall(
  {
    secrets: [anthropicApiKey], // Declara que esta function usa este secret
  },
  async (request) => {
    // Acessa o secret
    const apiKey = anthropicApiKey.value();
    // Use apiKey aqui...
  }
);
```

### Build do Frontend
```bash
# Instalar dependências
npm install

# Build para produção
npm run build
```

### Build das Functions
```bash
# Entrar na pasta functions
cd functions

# Instalar dependências
npm install

# Build TypeScript
npm run build

# Voltar para raiz
cd ..
```

## 🚀 4. Deploy para Produção

### Deploy Completo (Hosting + Functions + Firestore Rules)
```bash
# Deploy tudo de uma vez
npm run firebase:deploy

# Ou usando Firebase CLI diretamente
firebase deploy
```

### Deploy Seletivo

#### Apenas Hosting (Frontend)
```bash
firebase deploy --only hosting
```

#### Apenas Functions (Backend)
```bash
firebase deploy --only functions
```

#### Apenas Firestore Rules
```bash
firebase deploy --only firestore:rules
```

#### Deploy de uma Function específica
```bash
firebase deploy --only functions:analyzeMentorship
```

## 🔍 5. Verificação Pós-Deploy

### Verificar Functions
```bash
# Listar functions deployadas
firebase functions:list

# Ver logs em tempo real
firebase functions:log

# Ver logs de uma function específica
firebase functions:log --only analyzeMentorship
```

### Verificar Secrets
```bash
# Verificar se secrets estão configurados
firebase functions:secrets:list

# Testar acesso ao secret
firebase functions:secrets:access ANTHROPIC_API_KEY
```

### Testar a Aplicação
1. Acesse a URL do Firebase Hosting: `https://<your-project-id>.web.app`
2. Teste o login
3. Teste as funcionalidades de AI
4. Monitore os logs no Firebase Console

## 🔄 6. Workflow de Deploy Recomendado

### Para Desenvolvimento
```bash
# Usar emuladores localmente
npm run dev:full

# Ou separadamente
npm run emulators  # Terminal 1
npm run dev        # Terminal 2
```

### Para Staging/Testing
```bash
# Deploy para projeto de staging
firebase use staging
firebase deploy
```

### Para Produção
```bash
# Certificar-se que está no projeto correto
firebase use production

# Build e teste local
npm run build
npm run preview

# Deploy
npm run firebase:deploy

# Verificar logs
firebase functions:log --since 5m
```

## 📊 7. Monitoramento

### Firebase Console
- **Functions**: https://console.firebase.google.com/project/YOUR-PROJECT/functions
- **Hosting**: https://console.firebase.google.com/project/YOUR-PROJECT/hosting
- **Firestore**: https://console.firebase.google.com/project/YOUR-PROJECT/firestore

### Logs
```bash
# Logs em tempo real
firebase functions:log

# Logs das últimas 2 horas
firebase functions:log --since 2h

# Logs com filtro
firebase functions:log --only analyzeMentorship --since 1h
```

## ⚠️ 8. Troubleshooting

### Erro: "Secret ANTHROPIC_API_KEY not found"
```bash
# Reconfigurar o secret
firebase functions:secrets:set ANTHROPIC_API_KEY

# Fazer redeploy das functions
firebase deploy --only functions
```

### Erro: "Permission denied" nos secrets
```bash
# Verificar IAM roles no Google Cloud Console
# Adicionar role: Secret Manager Secret Accessor
```

### Functions muito lentas (Cold Start)
- Considere usar min instances para functions críticas:
```typescript
export const myFunction = onCall({
  minInstances: 1, // Mantém 1 instância sempre ativa
  secrets: [anthropicApiKey]
}, async (request) => { ... });
```

### Erro de build das Functions
```bash
cd functions
rm -rf node_modules lib
npm install
npm run build
cd ..
firebase deploy --only functions
```

## 🔒 9. Checklist de Segurança

- [ ] `.env` está no `.gitignore`
- [ ] `functions/.env` está no `functions/.gitignore`
- [ ] Secrets configurados no Firebase Secret Manager
- [ ] Firestore Rules revisadas e testadas
- [ ] CORS configurado corretamente nas Functions
- [ ] API Keys do Firebase têm restrições de domínio (Firebase Console)
- [ ] Billing alerts configurados no Google Cloud
- [ ] Backup do Firestore configurado

## 📚 10. Recursos Adicionais

- [Firebase Secrets Documentation](https://firebase.google.com/docs/functions/config-env#secret-manager)
- [Firebase Deploy Documentation](https://firebase.google.com/docs/cli#deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Cloud Functions Best Practices](https://firebase.google.com/docs/functions/best-practices)

## 🆘 Suporte

Em caso de problemas:
1. Verifique os logs: `firebase functions:log`
2. Consulte o Firebase Console
3. Verifique a documentação oficial
4. Contate o time de desenvolvimento

---

**Last Updated:** $(date)
**Maintainer:** Development Team

