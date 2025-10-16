# 🚀 Aumigo - Início Rápido

## ⚡ Setup em 3 passos

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar ambiente
```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar .env com suas configurações
# Mínimo necessário:
# MONGODB_URI=mongodb://localhost:27017/aumigo
# JWT_SECRET=seu_jwt_secret_aqui
```

### 3. Iniciar aplicação
```bash
# Desenvolvimento
npm run dev

# Ou produção
npm start
```

## 🐾 Acessar aplicação
```
http://localhost:3000
```

## 📊 Popular banco com dados de exemplo
```bash
npm run populate
```

## 🔑 Contas de teste criadas
- **ONG Amigos dos Bichos**: `ong@amigosdosbichos.com` / `123456`
- **Maria Silva**: `maria@email.com` / `123456`
- **João Santos**: `joao@email.com` / `123456`
- **ONG Patas & Corações**: `contato@patasecoracoes.org` / `123456`
- **Ana Costa**: `ana@email.com` / `123456`

## 🎯 Funcionalidades principais

### ✅ Implementadas
- [x] Sistema de login/cadastro (CPF/CNPJ)
- [x] Feed de animais estilo OLX
- [x] Busca e filtros avançados
- [x] Cadastro de animais com fotos
- [x] Página de detalhes do animal
- [x] Perfil do usuário
- [x] Design responsivo
- [x] Validação de documentos

### 🔄 Em desenvolvimento
- [ ] Sistema de chat
- [ ] Favoritar animais
- [ ] Notificações
- [ ] Integração WhatsApp

## 🛠️ Estrutura do projeto
```
aumigo/
├── models/          # Modelos MongoDB
├── routes/          # API Routes
├── middleware/      # Middlewares
├── public/          # Frontend
├── scripts/         # Scripts utilitários
├── data/           # Dados de exemplo
└── server.js       # Servidor principal
```

## 📱 Testando a aplicação

1. **Acesse** `http://localhost:3000`
2. **Cadastre-se** como pessoa ou ONG
3. **Faça login** com suas credenciais
4. **Cadastre** um animal
5. **Explore** o feed de adoção
6. **Use** os filtros de busca

## 🆘 Problemas comuns

### MongoDB não conecta
```bash
# Verificar se MongoDB está rodando
mongod --version

# Ou usar MongoDB Atlas (cloud)
# Atualizar MONGODB_URI no .env
```

### Porta 3000 ocupada
```bash
# Alterar porta no .env
PORT=3001
```

### Erro de permissões
```bash
# Dar permissão de execução aos scripts
chmod +x scripts/*.js
```

## 🎨 Customização

### Cores
Editar variáveis CSS em `public/styles.css`:
```css
:root {
    --primary-brown: #5B2C1B;
    --primary-orange: #F78C3D;
    --light-beige: #F5F1EB;
}
```

### Logo
Substituir ícone em `public/index.html`:
```html
<i class="fas fa-paw"></i> <!-- Trocar por sua logo -->
```

## 📞 Suporte
- 📧 Email: contato@aumigo.com.br
- 🐛 Issues: [GitHub Issues]
- 📖 Docs: [README.md](./README.md)

---

**🐾 Aumigo - Conectando corações e patas!**
