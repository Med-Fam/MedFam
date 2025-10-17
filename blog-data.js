// blog-data.js - This file can be hosted on GitHub and updated separately
const blogPosts = [
    {
        id: 1,
        title: "10 Study Techniques Every Medical Student Should Know",
        excerpt: "Discover proven study methods that can help you retain complex medical information more effectively.",
        category: "Study Tips",
        date: "2025-03-15",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        popular: true
    },
    // Add more blog posts here as needed
];

// Function to load blog data (to be called from main HTML)
function loadBlogData() {
    return blogPosts;
}
