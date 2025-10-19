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
        console.log('Loading blog data...');
        const response = await fetch('./blog-data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        blogPosts = await response.json();
        console.log('Blog data loaded successfully:', blogPosts.length, 'posts');
        
        // Initialize blog
        initializeBlog();
        
    } catch (error) {
        console.error('Error loading blog data:', error);
        showNotification('Error loading blog posts. Please try again later.', 'error');
    }
}

function initializeBlog() {
    if (blogPosts.length === 0) {
        console.log('No blog posts available');
        return;
    }
    
    filteredPosts = [...blogPosts];
    renderBlogPosts();
    renderPopularPosts();
    renderCategories();
    setupBlogEventListeners();
    
    console.log('Blog initialized with', blogPosts.length, 'posts');
}

function renderBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) {
        console.error('Blog grid element not found');
        return;
    }

    const startIndex = (currentPage - 1) * postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, startIndex + postsPerPage);
    
    if (postsToShow.length === 0) {
        blogGrid.innerHTML = '<p class="no-results">No articles found matching your criteria.</p>';
        return;
    }

    blogGrid.innerHTML = postsToShow.map(post => `
        <div class="blog-card">
            <img src="${post.image}" alt="${post.title}" class="blog-image">
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${post.category}</span>
                    <span>${formatDate(post.date)}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="#" class="blog-read-more" data-post-id="${post.id}">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');

    renderPagination();
}

function renderPopularPosts() {
    const container = document.getElementById('popularPosts');
    if (!container) return;

    const popular = blogPosts.filter(post => post.popular).slice(0, 5);
    
    if (popular.length === 0) {
        container.innerHTML = '<p>No popular posts available.</p>';
        return;
    }

    container.innerHTML = popular.map(post => `
        <div class="popular-post" data-post-id="${post.id}">
            <img src="${post.image}" alt="${post.title}" class="popular-post-img">
            <div class="popular-post-content">
                <h4>${post.title}</h4>
                <div class="popular-post-date">${formatDate(post.date)}</div>
            </div>
        </div>
    `).join('');
}

function renderCategories() {
    const container = document.getElementById('categoriesList');
    if (!container) return;

    const categories = {};
    blogPosts.forEach(post => {
        categories[post.category] = (categories[post.category] || 0) + 1;
    });

    container.innerHTML = `
        <li class="category-item" data-category="All">
            <span class="category-name">All</span>
            <span class="category-count">${blogPosts.length}</span>
        </li>
        ${Object.entries(categories).map(([category, count]) => `
            <li class="category-item" data-category="${category}">
                <span class="category-name">${category}</span>
                <span class="category-count">${count}</span>
            </li>
        `).join('')}
    `;
}

function renderPagination() {
    const container = document.getElementById('blogPagination');
    if (!container) return;

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }

    container.innerHTML = paginationHTML;
}

function setupBlogEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        const performSearch = () => {
            const term = searchInput.value.toLowerCase().trim();
            filteredPosts = term ? 
                blogPosts.filter(post => 
                    post.title.toLowerCase().includes(term) ||
                    post.excerpt.toLowerCase().includes(term) ||
                    post.category.toLowerCase().includes(term)
                ) : [...blogPosts];
            
            currentPage = 1;
            renderBlogPosts();
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', e => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // Category filters
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            e.target.classList.add('active');
            
            currentCategory = e.target.textContent;
            filteredPosts = currentCategory === 'All' ? 
                [...blogPosts] : 
                blogPosts.filter(post => post.category === currentCategory);
            
            currentPage = 1;
            renderBlogPosts();
        }

        // Category list items
        if (e.target.closest('.category-item')) {
            const categoryItem = e.target.closest('.category-item');
            const category = categoryItem.dataset.category;
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.textContent === category);
            });
            
            currentCategory = category;
            filteredPosts = category === 'All' ? 
                [...blogPosts] : 
                blogPosts.filter(post => post.category === category);
            
            currentPage = 1;
            renderBlogPosts();
        }

        // Pagination
        if (e.target.closest('.pagination-btn')) {
            const btn = e.target.closest('.pagination-btn');
            currentPage = parseInt(btn.dataset.page);
            renderBlogPosts();
        }

        // Read more links
        if (e.target.classList.contains('blog-read-more') || 
            e.target.closest('.blog-read-more')) {
            e.preventDefault();
            const link = e.target.classList.contains('blog-read-more') ? 
                e.target : e.target.closest('.blog-read-more');
            const postId = parseInt(link.dataset.postId);
            openBlogPost(postId);
        }

        // Popular posts
        if (e.target.closest('.popular-post')) {
            const popularPost = e.target.closest('.popular-post');
            const postId = parseInt(popularPost.dataset.postId);
            openBlogPost(postId);
        }
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            showNotification(`Thank you for subscribing with ${email}!`, 'success');
            newsletterForm.reset();
        });
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function openBlogPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    // Update modal content
    document.getElementById('modalCategory').textContent = post.category;
    document.getElementById('modalDate').textContent = formatDate(post.date);
    document.getElementById('modalTitle').textContent = post.title;
    
    const modalImage = document.getElementById('modalImage');
    modalImage.src = post.image;
    modalImage.alt = post.title;

    // Convert markdown-like content to HTML
    let content = post.fullContent
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
        .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
        .replace(/- (.*?)(\n|$)/g, '<li>$1</li>')
        .replace(/\d\. (.*?)(\n|$)/g, '<li>$1</li>');

    document.getElementById('modalContent').innerHTML = `<p>${content}</p>`;

    // Show modal
    document.getElementById('blogModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeBlogPost() {
    document.getElementById('blogModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside or pressing Escape
document.addEventListener('click', (e) => {
    if (e.target.id === 'blogModal') {
        closeBlogPost();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBlogPost();
    }
});
// ===== WEB APP FUNCTIONALITY =====

// PWA Installation
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.style.display = 'flex';
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installPrompt.style.display = 'none';
        }
        deferredPrompt = null;
    }
});

function closeInstallPrompt() {
    installPrompt.style.display = 'none';
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Volunteer Dashboard Functions
function logVolunteerHours() {
    const hours = prompt('Enter volunteer hours:');
    if (hours && !isNaN(hours)) {
        const totalHours = parseInt(document.getElementById('totalHours').textContent) + parseInt(hours);
        document.getElementById('totalHours').textContent = totalHours;
        updateVolunteerRank(totalHours);
        showNotification(`Successfully logged ${hours} volunteer hours!`, 'success');
    }
}

function findOpportunities() {
    document.getElementById('volunteer').scrollIntoView({ behavior: 'smooth' });
}

function downloadCertificate() {
    showNotification('Volunteer certificate generation feature coming soon!', 'info');
}

function updateVolunteerRank(hours) {
    let rank = 'New';
    if (hours >= 100) rank = 'Gold';
    else if (hours >= 50) rank = 'Silver';
    else if (hours >= 25) rank = 'Bronze';
    else if (hours >= 10) rank = 'Active';
    
    document.getElementById('currentRank').textContent = rank;
    document.getElementById('pointsEarned').textContent = hours * 10;
}

// Payment Functions
let currentTier = '';
let currentAmount = 0;

function openPaymentModal(amount, tier) {
    currentAmount = amount;
    currentTier = tier;
    
    document.getElementById('paymentDetails').innerHTML = `
        <div style="background: var(--light-beige); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: var(--primary-brown);">${tier} Tier</h3>
            <p style="margin: 0; font-size: 1.5rem; font-weight: bold; color: var(--accent-green);">$${amount}</p>
        </div>
    `;
    
    document.getElementById('paymentModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification(`Thank you for your $${currentAmount} ${currentTier} sponsorship! We'll contact you shortly.`, 'success');
    closePaymentModal();
    this.reset();
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.id === 'paymentModal') {
        closePaymentModal();
    }
});

// Load volunteer opportunities
function loadVolunteerOpportunities() {
    const opportunities = [
        {
            title: "Community Health Screening",
            description: "Assist in blood pressure checks, BMI measurements, and health education",
            location: "Local Community Center",
            date: "2025-04-15",
            duration: "4 hours",
            spots: "8/15 available"
        },
        {
            title: "Medical School Tutoring",
            description: "Help first-year students with anatomy and physiology concepts",
            location: "Online",
            date: "Ongoing",
            duration: "2 hours/week",
            spots: "5/10 available"
        },
        {
            title: "Health Fair Volunteer",
            description: "Staff booths and provide health information at annual community health fair",
            location: "City Park",
            date: "2025-05-20",
            duration: "6 hours",
            spots: "12/20 available"
        }
    ];

    const grid = document.getElementById('opportunitiesGrid');
    grid.innerHTML = opportunities.map(opp => `
        <div class="opportunity-card">
            <div class="opportunity-header">
                <div>
                    <h4 class="opportunity-title">${opp.title}</h4>
                    <p>${opp.description}</p>
                </div>
            </div>
            <div class="opportunity-meta">
                <span class="meta-item"><i class="fas fa-map-marker-alt"></i> ${opp.location}</span>
                <span class="meta-item"><i class="fas fa-calendar"></i> ${opp.date}</span>
                <span class="meta-item"><i class="fas fa-clock"></i> ${opp.duration}</span>
                <span class="meta-item"><i class="fas fa-users"></i> ${opp.spots}</span>
            </div>
            <div class="opportunity-actions">
                <button class="btn btn-primary btn-small" onclick="signUpForOpportunity('${opp.title}')">
                    <i class="fas fa-plus"></i> Sign Up
                </button>
                <button class="btn btn-secondary btn-small" onclick="viewOpportunityDetails('${opp.title}')">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `).join('');
}

function signUpForOpportunity(title) {
    showNotification(`Successfully signed up for "${title}"! We'll contact you with details.`, 'success');
}

function viewOpportunityDetails(title) {
    showNotification(`Details for "${title}" - more information coming soon!`, 'info');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadVolunteerOpportunities();
});
