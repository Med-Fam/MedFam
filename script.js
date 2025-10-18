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
        console.log('Blog data loaded successfully:', blogPosts);
        
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
