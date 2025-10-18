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
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // allow keyboard toggle
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
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== SCROLL-BASED ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.goal-card, .about-text, .about-image, .join-text, .join-cta, .contact-info, .contact-form, .stat-item, .involved-card, .team-card, .calendar-card, .event-item, .cta-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // ===== SCROLL INDICATOR =====
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // ===== EMAIL VALIDATION =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ===== PARALLAX EFFECT FOR HERO =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // ===== HOVER EFFECTS FOR CARDS =====
    const cards = document.querySelectorAll('.goal-card, .cta-card, .contact-item, .involved-card, .team-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== LAZY LOADING FOR IMAGES (if any are added later) =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
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

    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    console.log('Med.fam website loaded successfully! 🩺');
});
// ===== BLOG FUNCTIONALITY =====
let blogPosts = [];
let currentPage = 1;
const postsPerPage = 6;
let filteredPosts = [];
let currentCategory = 'All';

// Load blog data from JSON file
async function loadBlogData() {
    try {
        const response = await fetch('https://med-fam.github.io/MedFam/blog-data.json');
        blogPosts = await response.json();
        filteredPosts = [...blogPosts];
        initializeBlog();
    } catch (error) {
        console.error('Error loading blog data:', error);
        // Fallback to sample data
        blogPosts = [
            {
                id: 1,
                title: "Welcome to Med.Fam Blog",
                excerpt: "Stay tuned for upcoming articles and updates from our medical community.",
                category: "Updates",
                date: "2025-01-01",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                popular: true
            }
        ];
        filteredPosts = [...blogPosts];
        initializeBlog();
    }
}

// Initialize blog after data is loaded
function initializeBlog() {
    renderBlogPosts();
    renderPopularPosts();
    renderCategories();
    setupBlogEventListeners();
}

// Render blog posts
function renderBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    blogGrid.innerHTML = '';

    if (postsToShow.length === 0) {
        blogGrid.innerHTML = '<p class="no-results">No articles found matching your criteria.</p>';
        return;
    }

    postsToShow.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-card';
        postElement.innerHTML = `
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
        `;
        blogGrid.appendChild(postElement);
    });

    renderPagination();
}

// Render popular posts
function renderPopularPosts() {
    const popularPostsContainer = document.getElementById('popularPosts');
    if (!popularPostsContainer) return;
    
    const popularPosts = blogPosts.filter(post => post.popular).slice(0, 5);

    popularPostsContainer.innerHTML = '';

    popularPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'popular-post';
        postElement.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="popular-post-img">
            <div class="popular-post-content">
                <h4>${post.title}</h4>
                <div class="popular-post-date">${formatDate(post.date)}</div>
            </div>
        `;
        popularPostsContainer.appendChild(postElement);
    });
}

// Render categories
function renderCategories() {
    const categoriesContainer = document.getElementById('categoriesList');
    if (!categoriesContainer) return;
    
    const categories = {};

    blogPosts.forEach(post => {
        if (categories[post.category]) {
            categories[post.category]++;
        } else {
            categories[post.category] = 1;
        }
    });

    categoriesContainer.innerHTML = '';

    // Add "All" category
    const allItem = document.createElement('li');
    allItem.className = 'category-item';
    allItem.innerHTML = `
        <span class="category-name">All</span>
        <span class="category-count">${blogPosts.length}</span>
    `;
    categoriesContainer.appendChild(allItem);

    // Add other categories
    for (const category in categories) {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <span class="category-name">${category}</span>
            <span class="category-count">${categories[category]}</span>
        `;
        categoriesContainer.appendChild(categoryItem);
    }
}

// Render pagination
function renderPagination() {
    const paginationContainer = document.getElementById('blogPagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => {
            currentPage--;
            renderBlogPosts();
        });
        paginationContainer.appendChild(prevBtn);
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderBlogPosts();
            });
            paginationContainer.appendChild(pageBtn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }

    // Next button
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => {
            currentPage++;
            renderBlogPosts();
        });
        paginationContainer.appendChild(nextBtn);
    }
}

// Setup blog event listeners
function setupBlogEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredPosts = blogPosts.filter(post => 
                    post.title.toLowerCase().includes(searchTerm) || 
                    post.excerpt.toLowerCase().includes(searchTerm) ||
                    post.category.toLowerCase().includes(searchTerm)
                );
            } else {
                filteredPosts = [...blogPosts];
            }
            currentPage = 1;
            renderBlogPosts();
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Category filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter posts
            const category = btn.textContent;
            currentCategory = category;

            if (category === 'All') {
                filteredPosts = [...blogPosts];
            } else {
                filteredPosts = blogPosts.filter(post => post.category === category);
            }

            currentPage = 1;
            renderBlogPosts();
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            showNotification(`Thank you for subscribing with ${email}! You'll receive our updates soon.`, 'success');
            newsletterForm.reset();
        });
    }
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Your existing DOMContentLoaded code...
    
    // Add this line to initialize the blog:
    loadBlogData();
});
