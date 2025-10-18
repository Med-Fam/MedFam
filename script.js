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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        blogPosts = await response.json();
        console.log('Blog data loaded successfully:', blogPosts.length, 'posts');
        
        // Initialize blog functionality
        initializeBlog();
        
    } catch (error) {
        console.error('Error loading blog data:', error);
        // Fallback to hardcoded data if file not found
        console.log('Using fallback blog data...');
        blogPosts = getFallbackBlogData();
        initializeBlog();
    }
}

function getFallbackBlogData() {
    return [
        {
            "id": 1,
            "title": "10 Study Techniques Every Medical Student Should Know",
            "excerpt": "Discover proven study methods that can help you retain complex medical information more effectively.",
            "category": "Study Tips",
            "date": "2025-03-15",
            "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            "popular": true,
            "fullContent": "Medical school demands exceptional study habits to master vast amounts of complex information. Here are 10 proven techniques that can transform your learning experience..."
        },
        {
            "id": 2,
            "title": "The Future of Telemedicine: What Medical Students Need to Know",
            "excerpt": "Exploring how telehealth is reshaping healthcare delivery and what it means for future practitioners.",
            "category": "Medical News",
            "date": "2025-03-10",
            "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            "popular": true,
            "fullContent": "Telemedicine has evolved from a niche service to a fundamental component of healthcare delivery. As future medical professionals, understanding this digital transformation is crucial for your career..."
        }
    ];
}

function initializeBlog() {
    console.log('Initializing blog with', blogPosts.length, 'posts');
    filteredPosts = [...blogPosts];
    renderBlogPosts();
    renderPopularPosts();
    renderCategories();
    setupBlogEventListeners();
}
