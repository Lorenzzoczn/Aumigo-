// Gerenciamento de autenticação com Google

class GoogleAuth {
  constructor() {
    this.init();
  }

  init() {
    // Verificar se há token na URL (retorno do Google)
    this.checkUrlForToken();
    
    // Configurar event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Botão de login com Google
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => this.loginWithGoogle());
    }

    // Formulário de completar perfil
    const completeProfileForm = document.getElementById('complete-profile-form');
    if (completeProfileForm) {
      completeProfileForm.addEventListener('submit', (e) => this.handleCompleteProfile(e));
    }

    // Botão de pular perfil
    const skipProfileBtn = document.getElementById('skip-profile-btn');
    if (skipProfileBtn) {
      skipProfileBtn.addEventListener('click', () => this.skipProfileCompletion());
    }
  }

  checkUrlForToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      this.showToast('Erro na autenticação com Google', 'error');
      // Limpar URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Salvar token e dados do usuário
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Limpar URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Verificar se precisa completar perfil
        if (this.needsProfileCompletion(user)) {
          this.showCompleteProfileModal(user);
        } else {
          // Login completo
          this.handleSuccessfulLogin(user);
        }
        
      } catch (error) {
        console.error('Erro ao processar dados do usuário:', error);
        this.showToast('Erro ao processar login', 'error');
      }
    }
  }

  needsProfileCompletion(user) {
    // Verificar se usuário precisa completar informações básicas
    return !user.phone || !user.location?.city || !user.location?.state;
  }

  loginWithGoogle() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    // Mostrar loading
    googleLoginBtn.classList.add('loading');
    googleLoginBtn.disabled = true;
    
    // Redirecionar para autenticação Google
    window.location.href = '/api/auth/google';
  }

  showCompleteProfileModal(user) {
    const modal = document.getElementById('complete-profile-modal');
    if (modal) {
      // Pré-preencher dados conhecidos
      const userTypeSelect = document.getElementById('complete-user-type');
      if (userTypeSelect && user.userType) {
        userTypeSelect.value = user.userType;
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  async handleCompleteProfile(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      userType: formData.get('userType'),
      document: formData.get('document'),
      phone: formData.get('phone'),
      location: {
        city: formData.get('city'),
        state: formData.get('state')
      },
      description: formData.get('description') || ''
    };

    // Remover campos vazios
    Object.keys(data).forEach(key => {
      if (key === 'location') {
        Object.keys(data.location).forEach(locKey => {
          if (!data.location[locKey]) {
            delete data.location[locKey];
          }
        });
        if (Object.keys(data.location).length === 0) {
          delete data.location;
        }
      } else if (!data[key]) {
        delete data[key];
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Atualizar dados do usuário
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Fechar modal
        this.closeCompleteProfileModal();
        
        // Mostrar sucesso
        this.showToast('Perfil atualizado com sucesso!', 'success');
        
        // Fazer login completo
        this.handleSuccessfulLogin(result.user);
        
      } else {
        this.showToast(result.message || 'Erro ao atualizar perfil', 'error');
      }

    } catch (error) {
      console.error('Erro ao completar perfil:', error);
      this.showToast('Erro ao atualizar perfil', 'error');
    }
  }

  skipProfileCompletion() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.closeCompleteProfileModal();
    this.handleSuccessfulLogin(user);
    this.showToast('Você pode completar seu perfil depois na seção Perfil', 'info');
  }

  closeCompleteProfileModal() {
    const modal = document.getElementById('complete-profile-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  handleSuccessfulLogin(user) {
    // Atualizar interface
    this.updateUIForLoggedUser(user);
    
    // Fechar modal de login se estiver aberto
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
      loginModal.style.display = 'none';
    }
    
    // Mostrar toast de boas-vindas
    this.showToast(`Bem-vindo, ${user.name}!`, 'success');
    
    // Disparar evento customizado para outros scripts
    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
  }

  updateUIForLoggedUser(user) {
    // Esconder botões de auth
    const authButtons = document.getElementById('auth-buttons');
    if (authButtons) {
      authButtons.style.display = 'none';
    }

    // Mostrar menu do usuário
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
      userMenu.style.display = 'flex';
      
      // Atualizar informações do usuário
      const userName = document.getElementById('user-name');
      const userType = document.getElementById('user-type');
      const userAvatarImg = document.getElementById('user-avatar-img');
      const userAvatarIcon = document.getElementById('user-avatar-icon');
      
      if (userName) userName.textContent = user.name;
      if (userType) userType.textContent = user.userType === 'pessoa' ? 'Pessoa Física' : 'ONG';
      
      // Mostrar avatar do Google se disponível
      if (user.profileImage && userAvatarImg) {
        userAvatarImg.src = user.profileImage;
        userAvatarImg.style.display = 'block';
        if (userAvatarIcon) userAvatarIcon.style.display = 'none';
      }
    }

    // Adicionar badge do Google se for usuário Google
    if (user.googleId) {
      const userDetails = document.querySelector('.user-details');
      if (userDetails && !userDetails.querySelector('.google-user-badge')) {
        const badge = document.createElement('span');
        badge.className = 'google-user-badge';
        badge.innerHTML = '<i class="fab fa-google"></i>Google';
        userDetails.appendChild(badge);
      }
    }
  }

  showToast(message, type = 'info') {
    // Implementar sistema de toast (pode usar o existente no app)
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      // Fallback simples
      alert(message);
    }
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new GoogleAuth();
});

// Exportar para uso em outros scripts
window.GoogleAuth = GoogleAuth;