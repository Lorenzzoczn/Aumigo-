// Sistema de Administração Aumigo

class AdminSystem {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkUserRole();
  }

  setupEventListeners() {
    // Modal master login
    const masterLoginBtn = document.getElementById('master-login-btn');
    const closeMasterLogin = document.getElementById('close-master-login');
    const masterLoginForm = document.getElementById('master-login-form');

    if (masterLoginBtn) {
      masterLoginBtn.addEventListener('click', () => this.showMasterLoginModal());
    }

    if (closeMasterLogin) {
      closeMasterLogin.addEventListener('click', () => this.closeMasterLoginModal());
    }

    if (masterLoginForm) {
      masterLoginForm.addEventListener('submit', (e) => this.handleMasterLogin(e));
    }

    // Tabs do admin
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Refresh buttons
    const refreshUsers = document.getElementById('refresh-users');
    const refreshAnimals = document.getElementById('refresh-animals');

    if (refreshUsers) {
      refreshUsers.addEventListener('click', () => this.loadUsers());
    }

    if (refreshAnimals) {
      refreshAnimals.addEventListener('click', () => this.loadAnimals());
    }

    // Listen for user login events
    window.addEventListener('userLoggedIn', (e) => {
      this.currentUser = e.detail;
      this.checkUserRole();
    });
  }

  checkUserRole() {
    const user = this.currentUser || JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user.role === 'admin' || user.role === 'master') {
      this.showAdminFeatures();
      if (user.role === 'master') {
        this.showMasterFeatures();
      }
    } else {
      this.hideAdminFeatures();
    }
  }

  showAdminFeatures() {
    // Mostrar link de admin na navegação
    const adminLink = document.querySelector('.nav-link.admin-only');
    if (adminLink) {
      adminLink.style.display = 'flex';
    }

    // Adicionar badge de admin ao usuário
    const userDetails = document.querySelector('.user-details');
    if (userDetails && !userDetails.querySelector('.admin-badge')) {
      const badge = document.createElement('span');
      badge.className = 'admin-badge';
      badge.innerHTML = '<i class="fas fa-shield-alt"></i>Admin';
      userDetails.appendChild(badge);
    }
  }

  showMasterFeatures() {
    // Adicionar badge de master
    const userDetails = document.querySelector('.user-details');
    if (userDetails) {
      const adminBadge = userDetails.querySelector('.admin-badge');
      if (adminBadge) {
        adminBadge.className = 'admin-badge master-badge';
        adminBadge.innerHTML = '<i class="fas fa-crown"></i>Master';
      }
    }
  }

  hideAdminFeatures() {
    const adminLink = document.querySelector('.nav-link.admin-only');
    if (adminLink) {
      adminLink.style.display = 'none';
    }
  }

  showMasterLoginModal() {
    const modal = document.getElementById('master-login-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  closeMasterLoginModal() {
    const modal = document.getElementById('master-login-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  async handleMasterLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      masterKey: formData.get('masterKey')
    };

    try {
      const response = await fetch('/api/auth/master-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Salvar token e dados do usuário
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        this.currentUser = result.user;
        
        // Fechar modal
        this.closeMasterLoginModal();
        
        // Atualizar interface
        this.updateUIForMasterLogin(result.user);
        
        // Mostrar sucesso
        this.showToast('Login master realizado com sucesso!', 'success');
        
        // Carregar dashboard
        this.loadAdminDashboard();
        
      } else {
        this.showToast(result.message || 'Erro no login master', 'error');
      }

    } catch (error) {
      console.error('Erro no login master:', error);
      this.showToast('Erro no login master', 'error');
    }
  }

  updateUIForMasterLogin(user) {
    // Esconder botões de auth
    const authButtons = document.getElementById('auth-buttons');
    if (authButtons) {
      authButtons.style.display = 'none';
    }

    // Mostrar menu do usuário
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
      userMenu.style.display = 'flex';
      
      const userName = document.getElementById('user-name');
      const userType = document.getElementById('user-type');
      
      if (userName) userName.textContent = user.name;
      if (userType) userType.textContent = 'Administrador Master';
    }

    // Mostrar recursos de admin
    this.showAdminFeatures();
    this.showMasterFeatures();

    // Navegar para admin
    if (window.app && window.app.showSection) {
      window.app.showSection('admin');
    }
  }

  async loadAdminDashboard() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.updateDashboardStats(data.stats);
        this.updateRecentData(data.recentUsers, data.recentAnimals);
      }

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  }

  updateDashboardStats(stats) {
    document.getElementById('total-users').textContent = stats.totalUsers || 0;
    document.getElementById('total-animals').textContent = stats.totalAnimals || 0;
    document.getElementById('adopted-animals').textContent = stats.adoptedAnimals || 0;
    document.getElementById('available-animals').textContent = stats.availableAnimals || 0;
  }

  updateRecentData(recentUsers, recentAnimals) {
    // Atualizar usuários recentes
    const recentUsersContainer = document.getElementById('recent-users');
    if (recentUsersContainer && recentUsers) {
      recentUsersContainer.innerHTML = recentUsers.map(user => `
        <div class="recent-item">
          <div class="recent-info">
            <h5>${user.name}</h5>
            <p>${user.email}</p>
            <span class="recent-date">${new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <span class="user-type-badge">${user.userType}</span>
        </div>
      `).join('');
    }
  }

  async loadUsers() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.renderUsersTable(data.users);
      }

    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }

  renderUsersTable(users) {
    const container = document.getElementById('users-table');
    if (!container) return;

    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Role</th>
            <th>Localização</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">
                    ${user.profileImage ? 
                      `<img src="${user.profileImage}" alt="Avatar">` : 
                      '<i class="fas fa-user"></i>'
                    }
                  </div>
                  <span>${user.name}</span>
                </div>
              </td>
              <td>${user.email}</td>
              <td>
                <span class="type-badge ${user.userType}">${user.userType}</span>
              </td>
              <td>
                <span class="role-badge ${user.role}">${user.role}</span>
              </td>
              <td>${user.location?.city || ''}, ${user.location?.state || ''}</td>
              <td>${new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <div class="action-buttons">
                  ${this.currentUser?.role === 'master' ? `
                    <button class="btn btn-sm btn-outline" onclick="adminSystem.toggleUserRole('${user._id}', '${user.role}')">
                      <i class="fas fa-user-cog"></i>
                    </button>
                  ` : ''}
                  <button class="btn btn-sm btn-danger" onclick="adminSystem.deactivateUser('${user._id}')">
                    <i class="fas fa-ban"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  async toggleUserRole(userId, currentRole) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        this.showToast('Role atualizada com sucesso!', 'success');
        this.loadUsers();
      } else {
        const error = await response.json();
        this.showToast(error.message || 'Erro ao atualizar role', 'error');
      }

    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      this.showToast('Erro ao atualizar role', 'error');
    }
  }

  async deactivateUser(userId) {
    if (!confirm('Tem certeza que deseja desativar este usuário?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        this.showToast('Usuário desativado com sucesso!', 'success');
        this.loadUsers();
      } else {
        const error = await response.json();
        this.showToast(error.message || 'Erro ao desativar usuário', 'error');
      }

    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      this.showToast('Erro ao desativar usuário', 'error');
    }
  }

  switchTab(tabName) {
    // Atualizar botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Atualizar painéis
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-panel`).classList.add('active');

    // Carregar dados se necessário
    if (tabName === 'users') {
      this.loadUsers();
    } else if (tabName === 'animals') {
      this.loadAnimals();
    }
  }

  async loadAnimals() {
    // Implementar carregamento de animais similar aos usuários
    console.log('Carregando animais...');
  }

  showToast(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      alert(message);
    }
  }
}

// Inicializar sistema de admin
const adminSystem = new AdminSystem();

// Exportar para uso global
window.adminSystem = adminSystem;