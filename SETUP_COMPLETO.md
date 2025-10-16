# 🐾 Aumigo - Setup Completo

## Sistema de Adoção de Animais Premium com Login Google e Painel Admin

### 🚀 Funcionalidades Implementadas

#### ✨ Interface Premium
- Design moderno com gradientes e animações
- Efeitos glass morphism e hover premium
- Animações suaves e transições
- Interface responsiva e cativante

#### 🔐 Sistema de Autenticação
- Login tradicional com email/senha
- **Login com Google OAuth2**
- **Sistema de Administrador Master**
- Perfis de usuário completos

#### 👑 Painel Administrativo
- Dashboard com estatísticas em tempo real
- Gerenciamento de usuários
- Controle de animais
- Relatórios e gráficos
- Sistema de roles (user/admin/master)

### 🛠️ Configuração

#### 1. Instalar Dependências
```bash
cd aumigo
npm install
```

#### 2. Configurar Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione existente
3. Ative a API Google+ 
4. Crie credenciais OAuth 2.0:
   - Tipo: Web application
   - URIs autorizadas: `http://localhost:3000/api/auth/google/callback`

#### 3. Configurar Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/aumigo
JWT_SECRET=seu_jwt_secret_muito_seguro
SESSION_SECRET=seu_session_secret_muito_seguro
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# Frontend URL
CLIENT_URL=http://localhost:3000

# Master Admin Key (MANTENHA EM SEGREDO!)
MASTER_KEY=aumigo_master_2024_super_secret_key
```

#### 4. Iniciar MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

#### 5. Iniciar Aplicação
```bash
npm run dev
```

### 🎯 Como Usar

#### Login Normal
1. Acesse `http://localhost:3000`
2. Clique em "Entrar"
3. Use email/senha ou "Entrar com Google"

#### Login Master Admin
1. Na tela de login, clique em "Acesso Master"
2. Use suas credenciais + chave master
3. Acesse o painel administrativo

#### Credenciais Master Padrão
- **Email**: seu_email@gmail.com
- **Senha**: sua_senha_segura
- **Chave Master**: `aumigo_master_2024_super_secret_key`

### 🎨 Recursos Visuais

#### Animações Premium
- Efeitos de entrada suaves
- Hover effects com morphing
- Gradientes animados
- Partículas flutuantes
- Glass morphism

#### Componentes Especiais
- Cards com efeito 3D
- Botões com animações
- Modais premium
- Loading states elegantes
- Toasts animados

### 🔧 Estrutura do Projeto

```
aumigo/
├── config/
│   └── passport.js          # Configuração Google OAuth
├── middleware/
│   └── adminAuth.js         # Middleware de autenticação admin
├── models/
│   ├── User.js             # Modelo de usuário (atualizado)
│   └── Animal.js           # Modelo de animal
├── routes/
│   ├── auth.js             # Rotas de autenticação
│   ├── admin.js            # Rotas administrativas
│   ├── animals.js          # Rotas de animais
│   └── users.js            # Rotas de usuários
├── public/
│   ├── index.html          # Interface principal
│   ├── premium-styles.css  # Estilos premium
│   ├── animations.css      # Animações
│   ├── auth-styles.css     # Estilos de autenticação
│   ├── google-auth.js      # Lógica Google OAuth
│   └── admin-system.js     # Sistema administrativo
└── server.js               # Servidor principal
```

### 🛡️ Segurança

- Senhas hasheadas com bcrypt
- JWT tokens seguros
- Validação de dados
- Middleware de autenticação
- Chave master para admin
- CORS configurado

### 📱 Responsividade

- Design mobile-first
- Breakpoints otimizados
- Interface adaptável
- Touch-friendly

### 🎉 Próximos Passos

1. **Configurar Google OAuth** com suas credenciais
2. **Definir chave master** segura
3. **Personalizar cores** e branding
4. **Adicionar mais animais** de exemplo
5. **Configurar domínio** para produção

### 🆘 Suporte

Se encontrar problemas:
1. Verifique as variáveis de ambiente
2. Confirme se MongoDB está rodando
3. Teste as credenciais Google OAuth
4. Verifique os logs do console

---

**🐾 Aumigo - Conectando corações e patas com tecnologia premium!**