// Aumigo - Sistema de Adoção de Animais
// JavaScript Principal

class AumigoApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 1;
        this.isLoading = false;
        this.animals = [];
        this.filteredAnimals = [];
        this.currentFilters = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadAnimals();
        this.setupNavigation();
    }

    // Event Listeners
    setupEventListeners() {
        // Loading screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
            }, 2000);
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Auth buttons
        document.getElementById('btn-login').addEventListener('click', () => this.showModal('login-modal'));
        document.getElementById('btn-register').addEventListener('click', () => this.showModal('register-modal'));
        document.getElementById('btn-logout').addEventListener('click', () => this.logout());
        
        // Modal controls
        document.getElementById('close-login').addEventListener('click', () => this.hideModal('login-modal'));
        document.getElementById('close-register').addEventListener('click', () => this.hideModal('register-modal'));
        document.getElementById('close-animal-detail').addEventListener('click', () => this.hideModal('animal-detail-modal'));
        
        // Form switches
        document.getElementById('switch-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('login-modal');
            this.showModal('register-modal');
        });
        
        document.getElementById('switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('register-modal');
            this.showModal('login-modal');
        });

        // User type change
        document.querySelectorAll('input[name="userType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const label = document.getElementById('document-label');
                const input = document.getElementById('register-document');
                
                if (e.target.value === 'ong') {
                    label.textContent = 'CNPJ';
                    input.placeholder = '00.000.000/0000-00';
                } else {
                    label.textContent = 'CPF';
                    input.placeholder = '000.000.000-00';
                }
            });
        });

        // Forms
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('add-animal-form').addEventListener('submit', (e) => this.handleAddAnimal(e));
        document.getElementById('profile-form').addEventListener('submit', (e) => this.handleUpdateProfile(e));

        // Search and filters
        document.getElementById('search-btn').addEventListener('click', () => this.applyFilters());
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applyFilters();
        });
        
        document.querySelectorAll('.filters select, .filters input[type="checkbox"]').forEach(element => {
            element.addEventListener('change', () => this.applyFilters());
        });

        // Load more
        document.getElementById('load-more-btn').addEventListener('click', () => this.loadMoreAnimals());

        // Image upload
        document.getElementById('animal-images').addEventListener('change', (e) => this.handleImageUpload(e));

        // Contact button
        document.getElementById('contact-btn').addEventListener('click', () => this.handleContact());
    }

    // Navigation
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Add active class to nav link
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Load section specific data
        if (sectionId === 'my-animals') {
            this.loadMyAnimals();
        } else if (sectionId === 'profile') {
            this.loadProfile();
        }
    }

    // Authentication
    async checkAuthStatus() {
        const token = localStorage.getItem('aumigo_token');
        if (token) {
            try {
                const response = await this.apiRequest('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.user) {
                    this.currentUser = response.user;
                    this.updateUIForLoggedInUser();
                }
            } catch (error) {
                localStorage.removeItem('aumigo_token');
                this.updateUIForLoggedOutUser();
            }
        }
    }

    updateUIForLoggedInUser() {
        document.getElementById('nav-menu').style.display = 'flex';
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-menu').style.display = 'flex';
        
        // Update user info in navbar
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-type').textContent = this.currentUser.userType === 'ong' ? 'ONG' : 'Pessoa Física';
        
        // Update profile info
        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-type').textContent = this.currentUser.userType === 'ong' ? 'ONG' : 'Pessoa Física';
        document.getElementById('profile-location').textContent = `${this.currentUser.location.city}, ${this.currentUser.location.state}`;
    }

    updateUIForLoggedOutUser() {
        document.getElementById('nav-menu').style.display = 'none';
        document.getElementById('auth-buttons').style.display = 'flex';
        document.getElementById('user-menu').style.display = 'none';
        this.currentUser = null;
        this.showSection('home');
    }

    async handleLogin(e) {
        e.preventDefault();
        this.showLoading(true);

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            const response = await this.apiRequest('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            localStorage.setItem('aumigo_token', response.token);
            this.currentUser = response.user;
            this.updateUIForLoggedInUser();
            this.hideModal('login-modal');
            this.showToast('Login realizado com sucesso!', 'success');
            this.showSection('home');

        } catch (error) {
            this.showToast(error.message || 'Erro ao fazer login', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        this.showLoading(true);

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Format location object
            data.location = {
                city: data.city,
                state: data.state
            };
            
            // Remove city and state from data
            delete data.city;
            delete data.state;

            const response = await this.apiRequest('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            localStorage.setItem('aumigo_token', response.token);
            this.currentUser = response.user;
            this.updateUIForLoggedInUser();
            this.hideModal('register-modal');
            this.showToast('Cadastro realizado com sucesso!', 'success');
            this.showSection('home');

        } catch (error) {
            this.showToast(error.message || 'Erro ao cadastrar', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    logout() {
        localStorage.removeItem('aumigo_token');
        this.updateUIForLoggedOutUser();
        this.showToast('Logout realizado com sucesso!', 'success');
    }

    // Animals
    async loadAnimals() {
        if (this.isLoading) return;
        
        this.showLoading(true);
        this.isLoading = true;

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: 12,
                ...this.currentFilters
            });

            const response = await this.apiRequest(`/api/animals?${params}`);
            
            if (this.currentPage === 1) {
                this.animals = response.animals;
            } else {
                this.animals = [...this.animals, ...response.animals];
            }

            this.renderAnimals();
            this.updateLoadMoreButton(response.pagination);

        } catch (error) {
            this.showToast('Erro ao carregar animais', 'error');
        } finally {
            this.showLoading(false);
            this.isLoading = false;
        }
    }

    renderAnimals() {
        const grid = document.getElementById('animals-grid');
        grid.innerHTML = '';

        this.animals.forEach(animal => {
            const card = this.createAnimalCard(animal);
            grid.appendChild(card);
        });
    }

    createAnimalCard(animal) {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.addEventListener('click', () => this.showAnimalDetail(animal));

        const mainImage = animal.images && animal.images.length > 0 
            ? animal.images.find(img => img.isMain) || animal.images[0]
            : null;

        card.innerHTML = `
            <img src="${mainImage ? mainImage.url : 'https://via.placeholder.com/300x250/F5F1EB/5B2C1B?text=Sem+Imagem'}" 
                 alt="${animal.name}" class="animal-image">
            <div class="animal-info">
                <h3 class="animal-name">${animal.name}</h3>
                <div class="animal-details">
                    <div class="animal-detail">
                        <i class="fas fa-birthday-cake"></i>
                        <span>${animal.age} ${animal.age === 1 ? 'ano' : 'anos'}</span>
                    </div>
                    <div class="animal-detail">
                        <i class="fas fa-paw"></i>
                        <span>${this.capitalizeFirst(animal.species)}</span>
                    </div>
                    <div class="animal-detail">
                        <i class="fas fa-ruler"></i>
                        <span>${this.capitalizeFirst(animal.size)}</span>
                    </div>
                    ${animal.isCastrated ? `
                    <div class="animal-detail">
                        <i class="fas fa-check-circle"></i>
                        <span>Castrado</span>
                    </div>
                    ` : ''}
                </div>
                <p class="animal-description">${animal.description}</p>
                <div class="animal-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${animal.location.city}, ${animal.location.state}</span>
                </div>
            </div>
        `;

        return card;
    }

    async showAnimalDetail(animal) {
        try {
            const response = await this.apiRequest(`/api/animals/${animal._id}`);
            const animalData = response;

            // Update modal content
            document.getElementById('animal-detail-name').textContent = animalData.name;
            document.getElementById('animal-detail-age').textContent = `${animalData.age} ${animalData.age === 1 ? 'ano' : 'anos'}`;
            document.getElementById('animal-detail-species').textContent = this.capitalizeFirst(animalData.species);
            document.getElementById('animal-detail-size').textContent = this.capitalizeFirst(animalData.size);
            document.getElementById('animal-detail-color').textContent = animalData.color;
            document.getElementById('animal-detail-description').textContent = animalData.description;
            document.getElementById('animal-detail-location').textContent = `${animalData.location.city}, ${animalData.location.state}`;
            document.getElementById('animal-detail-owner-name').textContent = animalData.owner.name;
            document.getElementById('animal-detail-owner-type').textContent = animalData.owner.userType === 'ong' ? 'ONG' : 'Pessoa Física';

            // Handle behavior section
            const behaviorSection = document.getElementById('animal-detail-behavior-section');
            if (animalData.behavior) {
                behaviorSection.style.display = 'block';
                document.getElementById('animal-detail-behavior').textContent = animalData.behavior;
            } else {
                behaviorSection.style.display = 'none';
            }

            // Handle images
            this.renderAnimalImages(animalData.images);

            this.showModal('animal-detail-modal');

        } catch (error) {
            this.showToast('Erro ao carregar detalhes do animal', 'error');
        }
    }

    renderAnimalImages(images) {
        const mainImage = document.getElementById('animal-detail-main-image');
        const thumbnailsContainer = document.getElementById('animal-detail-thumbnails');
        
        thumbnailsContainer.innerHTML = '';

        if (images && images.length > 0) {
            mainImage.src = images[0].url;
            mainImage.alt = images[0].alt || 'Imagem do animal';

            images.forEach((image, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                thumbnail.innerHTML = `<img src="${image.url}" alt="${image.alt || 'Imagem do animal'}">`;
                
                thumbnail.addEventListener('click', () => {
                    mainImage.src = image.url;
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                });

                thumbnailsContainer.appendChild(thumbnail);
            });
        } else {
            mainImage.src = 'https://via.placeholder.com/400x400/F5F1EB/5B2C1B?text=Sem+Imagem';
            mainImage.alt = 'Sem imagem disponível';
        }
    }

    applyFilters() {
        const search = document.getElementById('search-input').value;
        const species = document.getElementById('species-filter').value;
        const size = document.getElementById('size-filter').value;
        const city = document.getElementById('city-filter').value;
        const castrated = document.getElementById('castrated-filter').checked;

        this.currentFilters = {};
        
        if (search) this.currentFilters.search = search;
        if (species) this.currentFilters.species = species;
        if (size) this.currentFilters.size = size;
        if (city) this.currentFilters.city = city;
        if (castrated) this.currentFilters.isCastrated = true;

        this.currentPage = 1;
        this.loadAnimals();
    }

    async loadMoreAnimals() {
        this.currentPage++;
        await this.loadAnimals();
    }

    updateLoadMoreButton(pagination) {
        const button = document.getElementById('load-more-btn');
        const container = document.querySelector('.load-more-container');
        
        if (pagination.current >= pagination.pages) {
            container.style.display = 'none';
        } else {
            container.style.display = 'block';
        }
    }

    // My Animals
    async loadMyAnimals() {
        if (!this.currentUser) return;

        try {
            const response = await this.apiRequest(`/api/users/${this.currentUser.id}/animals`);
            this.renderMyAnimals(response.animals);
        } catch (error) {
            this.showToast('Erro ao carregar seus animais', 'error');
        }
    }

    renderMyAnimals(animals) {
        const grid = document.getElementById('my-animals-grid');
        grid.innerHTML = '';

        if (animals.length === 0) {
            grid.innerHTML = `
                <div class="text-center">
                    <p>Você ainda não cadastrou nenhum animal.</p>
                    <button class="btn btn-primary" onclick="app.showSection('add-animal')">
                        Cadastrar Primeiro Animal
                    </button>
                </div>
            `;
            return;
        }

        animals.forEach(animal => {
            const card = this.createAnimalCard(animal);
            grid.appendChild(card);
        });
    }

    // Add Animal
    async handleAddAnimal(e) {
        e.preventDefault();
        if (!this.currentUser) return;

        this.showLoading(true);

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Format location from user data
            data.location = {
                city: this.currentUser.location.city,
                state: this.currentUser.location.state
            };

            // Handle image uploads
            const imageFiles = document.getElementById('animal-images').files;
            if (imageFiles.length > 0) {
                // For now, we'll just store file names
                // In a real app, you'd upload to a service like AWS S3
                data.images = Array.from(imageFiles).map((file, index) => ({
                    url: URL.createObjectURL(file),
                    alt: file.name,
                    isMain: index === 0
                }));
            }

            const response = await this.apiRequest('/api/animals', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('aumigo_token')}`
                }
            });

            this.showToast('Animal cadastrado com sucesso!', 'success');
            e.target.reset();
            document.getElementById('image-preview').innerHTML = '';
            this.showSection('my-animals');
            this.loadMyAnimals();

        } catch (error) {
            this.showToast(error.message || 'Erro ao cadastrar animal', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleImageUpload(e) {
        const files = Array.from(e.target.files);
        const preview = document.getElementById('image-preview');
        
        preview.innerHTML = '';

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="remove-image" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                preview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    // Profile
    async loadProfile() {
        if (!this.currentUser) return;

        try {
            const response = await this.apiRequest('/api/users/profile', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('aumigo_token')}` }
            });

            const user = response.user || response;
            
            // Update profile form
            document.getElementById('profile-name-input').value = user.name;
            document.getElementById('profile-phone').value = user.phone || '';
            document.getElementById('profile-city').value = user.location.city;
            document.getElementById('profile-state').value = user.location.state;
            document.getElementById('profile-description').value = user.description || '';

            // Update profile display
            document.getElementById('profile-name').textContent = user.name;
            document.getElementById('profile-type').textContent = user.userType === 'ong' ? 'ONG' : 'Pessoa Física';
            document.getElementById('profile-location').textContent = `${user.location.city}, ${user.location.state}`;

        } catch (error) {
            this.showToast('Erro ao carregar perfil', 'error');
        }
    }

    async handleUpdateProfile(e) {
        e.preventDefault();
        if (!this.currentUser) return;

        this.showLoading(true);

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Format location object
            data.location = {
                city: data.city,
                state: data.state
            };
            
            delete data.city;
            delete data.state;

            const response = await this.apiRequest('/api/users/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('aumigo_token')}`
                }
            });

            this.currentUser = response.user;
            this.showToast('Perfil atualizado com sucesso!', 'success');
            this.loadProfile();

        } catch (error) {
            this.showToast(error.message || 'Erro ao atualizar perfil', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Contact
    handleContact() {
        // In a real app, this would open a chat or redirect to WhatsApp
        const phone = document.querySelector('.owner-info').textContent;
        this.showToast('Funcionalidade de contato será implementada em breve!', 'info');
    }

    // Utility Methods
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    async apiRequest(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AumigoApp();
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
