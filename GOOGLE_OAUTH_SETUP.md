# Configuração do Google OAuth para Aumigo

## Passo 1: Criar projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ (Google People API)

## Passo 2: Configurar OAuth 2.0

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure:
   - Application type: Web application
   - Name: Aumigo
   - Authorized redirect URIs: 
     - http://localhost:3000/api/auth/google/callback (desenvolvimento)
     - https://seudominio.com/api/auth/google/callback (produção)

## Passo 3: Configurar variáveis de ambiente

Copie as credenciais e adicione no arquivo `.env`:

```
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

## Passo 4: Instalar dependências

```bash
npm install
```

## Passo 5: Iniciar servidor

```bash
npm run dev
```

O login com Google estará disponível na página de login!