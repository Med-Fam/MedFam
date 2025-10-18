// ===== MED.FAM WEBSITE JAVASCRIPT =====
// Smooth scrolling, animations, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVBAR FUNCTIONALITY =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ===== SCROLL-BASED ANIMATIONS =====
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animated');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.goal-card, .about-text, .about-image, .join-text, .join-cta, .contact-info, .contact-form, .stat-item, .involved-card, .team-card, .calendar-card, .event-item, .cta-card')
        .forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

    // ===== SCROLL INDICATOR =====
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            if (!name || !email || !subject || !message)
                return showNotification('Please fill in all fields.', 'error');

            if (!isValidEmail(email))
                return showNotification('Please enter a valid email address.', 'error');

            showNotification("Thank you for your message! We'll get back to you soon.", 'success');
            this.reset();
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white; padding: 1rem 1.5rem; border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 10000;
            transform: translateX(400px); transition: transform 0.3s ease; max-width: 350px;
        `;
        document.body.appendChild(notification);
        setTimeout(() => (notification.style.transform = 'translateX(0)'), 100);
        notification.querySelector('.notification-close').addEventListener('click', () => closeNotification(notification));
        setTimeout(() => closeNotification(notification), 5000);
    }

    function closeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }

    // ===== PARALLAX EFFECT =====
    window.addEventListener('scroll', function() {
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) heroBackground.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
    });

    // ===== HOVER EFFECTS =====
    document.querySelectorAll('.goal-card, .cta-card, .contact-item, .involved-card, .team-card').forEach(card => {
        card.addEventListener('mouseenter', () => (card.style.transform = 'translateY(-5px) scale(1.02)'));
        card.addEventListener('mouseleave', () => (card.style.transform = 'translateY(0) scale(1)'));
    });

    // ===== LAZY LOADING =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));

    // ===== ACTIVE NAV LINK HIGHLIGHT =====
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 200)
                current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });

    // ===== BLOG INITIALIZATION =====
    loadBlogData();

    console.log('Med.Fam website loaded successfully! 🩺');
});

// ===== BLOG FUNCTIONALITY =====
let blogPosts = [];
let currentPage = 1;
const postsPerPage = 6;
let filteredPosts = [];
let currentCategory = 'All';

async function loadBlogData() {
    try {
        const response = await fetch('https://med-fam.github.io/MedFam/blog-data.json');
        if (!response.ok) throw new Error('Network error');
        blogPosts = await response.json();
    } catch (error) {
        console.error('Error loading blog data:', error);
        blogPosts = [{
            id: 1,
            title: "Welcome to Med.Fam Blog",
            excerpt: "Stay tuned for upcoming articles and updates from our medical community.",
            category: "Updates",
            date: "2025-01-01",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=500&q=80",
            popular: true
        }];
    }
    filteredPosts = [...blogPosts];
    initializeBlog();
}

function initializeBlog() {
    renderBlogPosts();
    renderPopularPosts();
    renderCategories();
    setupBlogEventListeners();
}

function renderBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    const startIndex = (currentPage - 1) * postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, startIndex + postsPerPage);
    blogGrid.innerHTML = postsToShow.length
        ? postsToShow.map(post => `
            <div class="blog-card">
                <img src="${post.image}" alt="${post.title}" class="blog-image">
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-category">${post.category}</span>
                        <span>${formatDate(post.date)}</span>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="#" class="blog-read-more" data-post-id="${post.id}">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>`).join('')
        : '<p class="no-results">No articles found matching your criteria.</p>';
    renderPagination();
}

function renderPopularPosts() {
    const container = document.getElementById('popularPosts');
    if (!container) return;
    const popular = blogPosts.filter(p => p.popular).slice(0, 5);
    container.innerHTML = popular.map(p => `
        <div class="popular-post">
            <img src="${p.image}" alt="${p.title}" class="popular-post-img">
            <div class="popular-post-content">
                <h4>${p.title}</h4>
                <div class="popular-post-date">${formatDate(p.date)}</div>
            </div>
        </div>`).join('');
}

function renderCategories() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    const categories = blogPosts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
    }, {});
    container.innerHTML = `
        <li class="category-item"><span class="category-name">All</span><span class="category-count">${blogPosts.length}</span></li>
        ${Object.entries(categories).map(([cat, count]) =>
            `<li class="category-item"><span class="category-name">${cat}</span><span class="category-count">${count}</span></li>`
        ).join('')}
    `;
}

function renderPagination() {
    const container = document.getElementById('blogPagination');
    if (!container) return;
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (totalPages <= 1) return container.innerHTML = '';
    container.innerHTML = '';
    if (currentPage > 1)
        container.appendChild(createPageButton('<i class="fas fa-chevron-left"></i>', () => { currentPage--; renderBlogPosts(); }));
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            const btn = createPageButton(i, () => { currentPage = i; renderBlogPosts(); }, i === currentPage);
            container.appendChild(btn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const span = document.createElement('span');
            span.className = 'pagination-ellipsis';
            span.textContent = '...';
            container.appendChild(span);
        }
    }
    if (currentPage < totalPages)
        container.appendChild(createPageButton('<i class="fas fa-chevron-right"></i>', () => { currentPage++; renderBlogPosts(); }));
}

function createPageButton(label, handler, active = false) {
    const btn = document.createElement('button');
    btn.className = `pagination-btn ${active ? 'active' : ''}`;
    btn.innerHTML = label;
    btn.addEventListener('click', handler);
    return btn;
}

function setupBlogEventListeners() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    if (searchInput && searchBtn) {
        const performSearch = () => {
            const term = searchInput.value.toLowerCase();
            filteredPosts = term
                ? blogPosts.filter(p => [p.title, p.excerpt, p.category].some(f => f.toLowerCase().includes(term)))
                : [...blogPosts];
            currentPage = 1;
            renderBlogPosts();
        };
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', e => e.key === 'Enter' && performSearch());
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.textContent;
            filteredPosts = currentCategory === 'All'
                ? [...blogPosts]
                : blogPosts.filter(p => p.category === currentCategory);
            currentPage = 1;
            renderBlogPosts();
        });
    });

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            showNotification(`Thank you for subscribing with ${email}! You'll receive our updates soon.`, 'success');
            newsletterForm.reset();
        });
    }
}

function formatDate(date) {
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

// ===== BLOG POST MODAL =====
function openBlogPost(postId) {
    const post = blogPosts.find(p => p.id == postId);
    if (!post) return;
    document.getElementById('modalCategory').textContent = post.category;
    document.getElementById('modalDate').textContent = formatDate(post.date);
    document.getElementById('modalTitle').textContent = post.title;
    const img = document.getElementById('modalImage');
    img.src = post.image;
    img.alt = post.title;
    const content = post.fullContent
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
        .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
        .replace(/- (.*?)(\n|$)/g, '<li>$1</li>')
        .replace(/1\. (.*?)(\n|$)/g, '<li>$1</li>');
    document.getElementById('modalContent').innerHTML = `<p>${content}</p>`;
    document.getElementById('blogModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeBlogPost() {
    document.getElementById('blogModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('click', e => e.target.id === 'blogModal' && closeBlogPost());
document.addEventListener('keydown', e => e.key === 'Escape' && closeBlogPost());
