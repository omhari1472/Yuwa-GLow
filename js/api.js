const API_BASE_URL = 'http://localhost:8000/api'; // Update this to your production URL on Bluehost

const apiFetch = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
};

const API = {
    // Products
    getProducts: () => apiFetch('/products/active'),
    getCategories: () => apiFetch('/categories/active'),

    // Blogs
    getBlogs: () => apiFetch('/blogs'),
    getBlogBySlug: (slug) => apiFetch(`/blogs/${slug}`),

    // Careers
    getCareers: () => apiFetch('/careers'),
    
    // Gallery
    getGallery: () => apiFetch('/gallery'),

    // Forms
    submitEnquiry: (data) => apiFetch('/enquire', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    submitApplication: (formData) => fetch(`${API_BASE_URL}/apply`, {
        method: 'POST',
        body: formData, // FormData handles its own headers and file uploads
    }).then(res => res.json()),

    // Distributors & Stockists
    getDistributors: () => apiFetch('/distributors'),
    getStockists: () => apiFetch('/stockists'),
};
