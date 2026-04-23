// =====================================
// CONFIGURAÇÕES INICIAIS
// =====================================

const ADMIN_PASSWORD = 'admin123';
const WHATSAPP_NUMBER = '5538999999999'; // Substitua pelo seu número

// Produtos padrão
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: 'Brigadeiro Gourmet',
        category: 'brigadeiros',
        description: 'Brigadeiro com chocolate premium',
        image: 'https://images.unsplash.com/photo-1624353629128-fdd9b0b67d0b?w=400&q=80'
    },
    {
        id: 2,
        name: 'Bolo de Chocolate',
        category: 'bolos',
        description: 'Bolo mofado e delicioso',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80'
    },
    {
        id: 3,
        name: 'Doce de Leite Cremoso',
        category: 'doces',
        description: 'Doce de leite com toque gourmet',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80'
    },
    {
        id: 4,
        name: 'Kit Festa Pequeno',
        category: 'kits',
        description: 'Kit com 12 doces sortidos',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80'
    }
];

const DEFAULT_GALLERY = [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    'https://images.unsplash.com/photo-1624353629128-fdd9b0b67d0b?w=500&q=80',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&q=80',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    'https://images.unsplash.com/photo-1624353629128-fdd9b0b67d0b?w=500&q=80'
];

// Estado global
let isAdminLogged = false;
let siteData = {};

// =====================================
// INICIALIZAÇÃO
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    loadSiteData();
    renderProducts();
    renderGallery();
    setupEventListeners();
    setupScrollReveal();
    initializeAdminPanel();
});

// =====================================
// CARREGAR/SALVAR DADOS (LocalStorage)
// =====================================

function loadSiteData() {
    const saved = localStorage.getItem('caseirinhoData');
    
    if (saved) {
        siteData = JSON.parse(saved);
    } else {
        // Dados padrão
        siteData = {
            heroTitle: 'Caseirinho Ateliê Gourmet',
            heroTagline: 'Amor e sabor em cada detalhe 🍰',
            heroBg: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80',
            aboutText: 'Na Caseirinho Ateliê Gourmet, cada doce é uma obra de arte. Nós utilizamos apenas ingredientes de primeira qualidade, sem conservantes ou aditivos desnecessários. Cada receita é desenvolvida com dedicação e carinho, resultando em produtos que agradam ao paladar mais exigente.',
            aboutImg: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80',
            whatsappNum: '(38) 99999-9999',
            phone: '(38) 3821-9999',
            address: 'Janaúba - MG',
            instagram: '#',
            facebook: '#',
            products: [...DEFAULT_PRODUCTS],
            gallery: [...DEFAULT_GALLERY]
        };
        saveSiteData();
    }
    
    // Atualizar elementos na página
    updatePageContent();
}

function saveSiteData() {
    localStorage.setItem('caseirinhoData', JSON.stringify(siteData));
}

function updatePageContent() {
    // Hero
    document.getElementById('heroTitle').textContent = siteData.heroTitle;
    document.getElementById('heroTagline').textContent = siteData.heroTagline;
    document.getElementById('heroBgImg').src = siteData.heroBg;
    
    // About
    document.getElementById('aboutText').textContent = siteData.aboutText;
    document.getElementById('aboutImg').src = siteData.aboutImg;
    
    // Contact
    document.getElementById('whatsappNum').textContent = siteData.whatsappNum;
    document.getElementById('phone').textContent = siteData.phone;
    document.getElementById('address').textContent = siteData.address;
    
    // Links
    updateWhatsAppLink();
    updatePhoneLink();
    document.getElementById('instagramLink').href = siteData.instagram;
    document.getElementById('facebookLink').href = siteData.facebook;
    document.getElementById('whatsappFooter').href = generateWhatsAppLink();
}

// =====================================
// PRODUTOS
// =====================================

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    siteData.products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card scroll-reveal';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description || ''}</p>
                <button class="btn btn-primary" onclick="orderProduct('${product.name}')">
                    Pedir no WhatsApp
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Trigger scroll reveal
    setTimeout(setupScrollReveal, 100);
}

function orderProduct(productName) {
    const message = `Olá! Gostaria de fazer um pedido: ${productName}`;
    window.open(generateWhatsAppLink(message), '_blank');
}

function addProduct(name, category, desc, image) {
    const newProduct = {
        id: Date.now(),
        name,
        category,
        description: desc,
        image
    };
    
    siteData.products.push(newProduct);
    saveSiteData();
    renderProducts();
    renderProductsList();
    
    showNotification('Produto adicionado com sucesso!', 'success');
}

function deleteProduct(id) {
    siteData.products = siteData.products.filter(p => p.id !== id);
    saveSiteData();
    renderProducts();
    renderProductsList();
    showNotification('Produto removido!', 'success');
}

function renderProductsList() {
    const list = document.getElementById('productsList');
    list.innerHTML = '';
    
    if (siteData.products.length === 0) {
        list.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
        return;
    }
    
    siteData.products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'list-item';
        
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="list-item-img">
            <div class="list-item-info">
                <div class="list-item-title">${product.name}</div>
                <div class="list-item-desc">${product.category} - ${product.description}</div>
            </div>
            <div class="list-item-actions">
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        `;
        
        list.appendChild(item);
    });
}

// =====================================
// GALERIA
// =====================================

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    
    siteData.gallery.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item scroll-reveal';
        item.style.animationDelay = `${index * 0.1}s`;
        
        item.innerHTML = `<img src="${image}" alt="Galeria ${index + 1}">`;
        
        grid.appendChild(item);
    });
    
    setTimeout(setupScrollReveal, 100);
}

function addGalleryImage(imageUrl) {
    siteData.gallery.push(imageUrl);
    saveSiteData();
    renderGallery();
    renderGalleriesList();
    
    showNotification('Imagem adicionada à galeria!', 'success');
}

function deleteGalleryImage(index) {
    siteData.gallery.splice(index, 1);
    saveSiteData();
    renderGallery();
    renderGalleriesList();
    
    showNotification('Imagem removida!', 'success');
}

function renderGalleriesList() {
    const list = document.getElementById('galleriesList');
    list.innerHTML = '';
    
    if (siteData.gallery.length === 0) {
        list.innerHTML = '<p>Nenhuma imagem na galeria.</p>';
        return;
    }
    
    siteData.gallery.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        
        item.innerHTML = `
            <img src="${image}" alt="Galeria" class="list-item-img">
            <div class="list-item-info">
                <div class="list-item-title">Imagem #${index + 1}</div>
                <div class="list-item-desc">${image.substring(0, 50)}...</div>
            </div>
            <div class="list-item-actions">
                <button class="btn-delete" onclick="deleteGalleryImage(${index})">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        `;
        
        list.appendChild(item);
    });
}

// =====================================
// WHATSAPP
// =====================================

function generateWhatsAppLink(message = '') {
    const phoneNumber = siteData.whatsappNum.replace(/\D/g, '');
    const msg = message || `Olá! Gostaria de fazer um pedido.`;
    const encodedMsg = encodeURIComponent(msg);
    return `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
}

function updateWhatsAppLink() {
    const link = generateWhatsAppLink('Olá! Gostaria de fazer um pedido.');
    document.getElementById('whatsappBtn').href = link;
    document.getElementById('whatsappLink').href = link;
    document.getElementById('whatsappContact').querySelector('.contact-link').href = link;
}

function updatePhoneLink() {
    const phone = siteData.phone.replace(/\D/g, '');
    document.getElementById('phoneLink').href = `tel:+55${phone}`;
}

// =====================================
// ADMIN PANEL
// =====================================

function initializeAdminPanel() {
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.getElementById('closeModal');
    const closeAdminPanel = document.getElementById('closeAdminPanel');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Abrir modal admin
    adminBtn.addEventListener('click', () => {
        adminModal.classList.add('active');
    });
    
    // Fechar modal
    closeModal.addEventListener('click', () => {
        adminModal.classList.remove('active');
        isAdminLogged = false;
    });
    
    closeAdminPanel.addEventListener('click', () => {
        adminModal.classList.remove('active');
        isAdminLogged = false;
    });
    
    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        if (password === ADMIN_PASSWORD) {
            isAdminLogged = true;
            document.getElementById('adminLoginForm').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            document.getElementById('password').value = '';
            renderProductsList();
            renderGalleriesList();
            showNotification('Login realizado com sucesso!', 'success');
        } else {
            showNotification('Senha incorreta!', 'error');
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', () => {
        isAdminLogged = false;
        document.getElementById('adminLoginForm').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        adminModal.classList.remove('active');
        showNotification('Desconectado com sucesso!', 'success');
    });
    
    // Abas
    const tabBtns = document.querySelectorAll('.tab-btn:not(.logout)');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Remove active de todos
            document.querySelectorAll('.tab-btn:not(.logout)').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Adiciona active ao clicado
            btn.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        });
    });
    
    // Formulário de produtos
    document.getElementById('addProductForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const desc = document.getElementById('productDesc').value;
        const image = document.getElementById('productImage').value;
        
        if (name && category && image) {
            addProduct(name, category, desc, image);
            document.getElementById('addProductForm').reset();
        } else {
            showNotification('Preencha todos os campos obrigatórios!', 'error');
        }
    });
    
    // Formulário de galeria
    document.getElementById('addGalleryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const image = document.getElementById('galleryImage').value;
        
        if (image) {
            addGalleryImage(image);
            document.getElementById('addGalleryForm').reset();
        } else {
            showNotification('Adicione uma URL de imagem!', 'error');
        }
    });
}

function saveField(inputId, elementId) {
    const value = document.getElementById(inputId).value;
    
    if (!value) {
        showNotification('Campo não pode estar vazio!', 'error');
        return;
    }
    
    // Atualizar no siteData
    if (inputId === 'editHeroTitle') {
        siteData.heroTitle = value;
    } else if (inputId === 'editHeroTagline') {
        siteData.heroTagline = value;
    } else if (inputId === 'editAboutText') {
        siteData.aboutText = value;
    } else if (inputId === 'editWhatsapp') {
        siteData.whatsappNum = value;
    } else if (inputId === 'editPhone') {
        siteData.phone = value;
    } else if (inputId === 'editAddress') {
        siteData.address = value;
    } else if (inputId === 'editHeroBg') {
        siteData.heroBg = value;
    } else if (inputId === 'editAboutBg') {
        siteData.aboutImg = value;
    } else if (inputId === 'editInstagram') {
        siteData.instagram = value;
    } else if (inputId === 'editFacebook') {
        siteData.facebook = value;
    }
    
    saveSiteData();
    updatePageContent();
    showNotification('Alteração salva com sucesso!', 'success');
}

function resetAllData() {
    if (confirm('Tem certeza? Esta ação não pode ser desfeita!')) {
        localStorage.removeItem('caseirinhoData');
        siteData = {
            heroTitle: 'Caseirinho Ateliê Gourmet',
            heroTagline: 'Amor e sabor em cada detalhe 🍰',
            heroBg: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80',
            aboutText: 'Na Caseirinho Ateliê Gourmet, cada doce é uma obra de arte...',
            aboutImg: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80',
            whatsappNum: '(38) 99999-9999',
            phone: '(38) 3821-9999',
            address: 'Janaúba - MG',
            instagram: '#',
            facebook: '#',
            products: [...DEFAULT_PRODUCTS],
            gallery: [...DEFAULT_GALLERY]
        };
        saveSiteData();
        loadSiteData();
        renderProductsList();
        renderGalleriesList();
        showNotification('Dados resetados para os padrões!', 'success');
    }
}

// =====================================
// SCROLL REVEAL (Animações ao Rolar)
// =====================================

function setupScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// =====================================
// EVENT LISTENERS
// =====================================

function setupEventListeners() {
    // Hero Button
    document.getElementById('heroBtn').addEventListener('click', () => {
        const message = 'Olá! Gostaria de fazer um pedido.';
        window.open(generateWhatsAppLink(message), '_blank');
    });
    
    // Fechar modal clicando fora
    const modal = document.getElementById('adminModal');
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            isAdminLogged = false;
        }
    });
}

// =====================================
// NOTIFICAÇÕES
// =====================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        ${type === 'success' ? 'background: #6BA586;' : 'background: #E74C3C;'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar estilo para fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
`;
document.head.appendChild(style);
