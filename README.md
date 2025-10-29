# 🐾 Aumigo - Sistema de Adoção de Animais

Sistema web completo inspirado na OLX, mas voltado à adoção de animais e cadastro de ONGs ou pessoas comuns.

## ✨ Características

- **Design Amigável**: Interface limpa com tons quentes (laranja, marrom e bege)
- **Autenticação Completa**: Login/cadastro para pessoas físicas e ONGs
- **Validação de Documentos**: CPF/CNPJ com validação real
- **Feed de Animais**: Sistema similar ao OLX para navegação
- **Busca e Filtros**: Pesquisa avançada por múltiplos critérios
- **Upload de Imagens**: Galeria de fotos para cada animal
- **Responsivo**: Funciona perfeitamente em mobile e desktop

## 🚀 Tecnologias

### Backend
- **Node.js** com Express
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **Bcrypt** para hash de senhas
- **Express Validator** para validações

### Frontend
- **HTML5** semântico
- **CSS3** com variáveis customizadas
- **JavaScript** ES6+ (Vanilla JS)
- **Font Awesome** para ícones
- **Google Fonts** (Poppins)

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB (local ou Atlas)
- NPM ou Yarn

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd aumigo
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/aumigo
   JWT_SECRET=seu_jwt_secret_aqui_muito_seguro
   NODE_ENV=development
   ```

4. **Inicie o MongoDB**
   - Local: `mongod`
   - Ou use MongoDB Atlas (cloud)

5. **Execute o projeto**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

6. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 📱 Funcionalidades

### 🔐 Autenticação
- [x] Cadastro de pessoa física (CPF)
- [x] Cadastro de ONG (CNPJ)
- [x] Login seguro com JWT
- [x] Validação de documentos
- [x] Perfil de usuário

### 🐕 Cadastro de Animais
- [x] Formulário completo de cadastro
- [x] Upload múltiplo de imagens
- [x] Informações detalhadas (idade, porte, castração)
- [x] Descrição e comportamento
- [x] Localização automática do usuário

### 🔍 Busca e Filtros
- [x] Busca por texto livre
- [x] Filtros por espécie, porte, cor
- [x] Filtro por localização
- [x] Filtro por castração
- [x] Paginação infinita

### 📱 Interface
- [x] Design responsivo
- [x] Feed de animais estilo OLX
- [x] Modal de detalhes do animal
- [x] Galeria de imagens
- [x] Navegação intuitiva

## 🎨 Design System

### Cores Principais
```css
--primary-brown: #5B2C1B    /* Marrom principal */
--primary-orange: #F78C3D    /* Laranja principal */
--light-beige: #F5F1EB       /* Bege claro */
--warm-beige: #E8DCC6        /* Bege quente */
```

### Tipografia
- **Fonte**: Poppins (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

## 📁 Estrutura do Projeto

```
aumigo/
├── models/              # Modelos do MongoDB
│   ├── User.js
│   └── Animal.js
├── routes/              # Rotas da API
│   ├── auth.js
│   ├── animals.js
│   └── users.js
├── middleware/          # Middlewares
│   └── auth.js
├── public/              # Frontend
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js            # Servidor principal
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Animais
- `GET /api/animals` - Listar animais (com filtros)
- `GET /api/animals/:id` - Detalhes de um animal
- `POST /api/animals` - Cadastrar animal
- `PUT /api/animals/:id` - Atualizar animal
- `DELETE /api/animals/:id` - Remover animal

### Usuários
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/:id` - Dados públicos do usuário
- `GET /api/users/:id/animals` - Animais de um usuário

## 🚀 Deploy

### Heroku
1. Crie um app no Heroku
2. Configure as variáveis de ambiente
3. Conecte ao MongoDB Atlas
4. Deploy via Git

### Vercel (Frontend) + Railway (Backend)
1. Deploy do backend no Railway
2. Deploy do frontend no Vercel
3. Configure as variáveis de ambiente

## 🔮 Funcionalidades Futuras

- [ ] Sistema de chat em tempo real
- [ ] Favoritar animais
- [ ] Painel administrativo
- [ ] Sistema de avaliações
- [ ] Notificações push
- [ ] Integração com WhatsApp
- [ ] Geolocalização avançada
- [ ] Relatórios e estatísticas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

Desenvolvido com ❤️ pela equipe Aumigo

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- Email: contato@aumigo.com.br
- GitHub Issues: [Link para issues]

---

**🐾 Adote, não compre! Aumigo conectando corações e patas.**

