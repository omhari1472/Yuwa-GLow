import CONFIG from './config.js';

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('admin_token');
    
    const headers = {
        'Accept': 'application/json',
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const result = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: result.message || 'Server Error',
                errors: result.errors || {}
            };
        }

        return {
            success: true,
            message: result.message || 'Success',
            data: result
        };

    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        return {
            success: false,
            message: error.message || 'Connection Failed',
            errors: error.errors || {}
        };
    }
};

const API = {
    // Auth
    login: (credentials) => apiFetch('/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => apiFetch('/logout', { method: 'POST' }),
    getMe: () => apiFetch('/me'),

    // Public Data
    getProducts: () => apiFetch('/products/active'),
    getCategories: () => apiFetch('/categories/active'),
    getBlogs: () => apiFetch('/blogs'),
    getBlog: (slug) => apiFetch(`/blogs/${slug}`),
    getCareers: () => apiFetch('/careers'),
    getGallery: () => apiFetch('/gallery'),
    getDashboardStats: () => apiFetch('/dashboard/stats'),

    // Forms
    submitEnquiry: (data) => apiFetch('/enquire', { method: 'POST', body: JSON.stringify(data) }),
    submitApplication: (formData) => apiFetch('/apply', { method: 'POST', body: formData }),

    // Admin Resources
    admin: {
        categories: {
            list: () => apiFetch('/categories'),
            create: (data) => apiFetch('/categories', { method: 'POST', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),
        },
        products: {
            list: () => apiFetch('/products'),
            create: (formData) => apiFetch('/products', { method: 'POST', body: formData }),
            update: (id, formData) => apiFetch(`/products/${id}`, { method: 'POST', body: formData }), // Post with _method spoofing for files
            delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
        },
        applications: {
            list: () => apiFetch('/applications'),
            updateStatus: (id, status) => apiFetch(`/applications/${id}/status`, { 
                method: 'PATCH', 
                body: JSON.stringify({ status }) 
            }),
            delete: (id) => apiFetch(`/applications/${id}`, { method: 'DELETE' }),
        },
        enquiries: {
            list: () => apiFetch('/enquiries'),
            delete: (id) => apiFetch(`/enquiries/${id}`, { method: 'DELETE' }),
        },
        blogs: {
            list: () => apiFetch('/blogs'),
            create: (formData) => apiFetch('/blogs', { method: 'POST', body: formData }),
            update: (id, formData) => apiFetch(`/blogs/${id}`, { method: 'POST', body: formData }),
            delete: (id) => apiFetch(`/blogs/${id}`, { method: 'DELETE' }),
        },
        gallery: {
            list: () => apiFetch('/gallery'),
            create: (formData) => apiFetch('/gallery', { method: 'POST', body: formData }),
            delete: (id) => apiFetch(`/gallery/${id}`, { method: 'DELETE' }),
        }
    }
};

export default API;