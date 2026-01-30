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
    changePassword: (data) => apiFetch('/change-password', { method: 'POST', body: JSON.stringify(data) }),

    // Public Data
    getProducts: () => apiFetch('/products/active'),
    getProduct: (id) => apiFetch(`/products/${id}`),
    getCategories: () => apiFetch('/categories/active'),
    getBlogs: () => apiFetch('/blogs/published'),
    getBlog: (slug) => apiFetch(`/blogs/${slug}`),
    getCareers: () => apiFetch('/careers/open'),
    getCareer: (id) => apiFetch(`/careers/${id}`),
    getGallery: () => apiFetch('/gallery'),
    getCarousel: () => apiFetch('/carousel'),
    getTransformations: () => apiFetch('/transformations'),
    getDistributors: () => apiFetch('/distributors'),
    getStockists: () => apiFetch('/stockists'),
    getPartnerAvailability: () => apiFetch('/partners/availability'),
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
            get: (id) => apiFetch(`/products/${id}`),
            create: (formData) => apiFetch('/products', { method: 'POST', body: formData }),
            update: (id, formData) => apiFetch(`/products/${id}`, { method: 'POST', body: formData }), // Post with _method spoofing for files
            delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
            deleteVariant: (productId, variantId) => apiFetch(`/products/${productId}/variants/${variantId}`, { method: 'DELETE' }),
            deleteImage: (productId, imageId) => apiFetch(`/products/${productId}/images/${imageId}`, { method: 'DELETE' }),
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
            reply: (id, reply) => apiFetch(`/enquiries/${id}/reply`, { method: 'POST', body: JSON.stringify({ reply }) }),
            updateStatus: (id, status) => apiFetch(`/enquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
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
            update: (id, formData) => apiFetch(`/gallery/${id}`, { method: 'POST', body: formData }),
            delete: (id) => apiFetch(`/gallery/${id}`, { method: 'DELETE' }),
        },
        carousel: {
            list: () => apiFetch('/carousel'),
            create: (formData) => apiFetch('/carousel', { method: 'POST', body: formData }),
            update: (id, formData) => apiFetch(`/carousel/${id}`, { method: 'POST', body: formData }),
            delete: (id) => apiFetch(`/carousel/${id}`, { method: 'DELETE' }),
            reorder: (order) => apiFetch('/carousel/reorder', { method: 'POST', body: JSON.stringify({ order }) }),
        },
        transformations: {
            list: () => apiFetch('/transformations'),
            create: (formData) => apiFetch('/transformations', { method: 'POST', body: formData }),
            update: (id, formData) => apiFetch(`/transformations/${id}`, { method: 'POST', body: formData }),
            delete: (id) => apiFetch(`/transformations/${id}`, { method: 'DELETE' }),
            reorder: (order) => apiFetch('/transformations/reorder', { method: 'POST', body: JSON.stringify({ order }) }),
        },
        careers: {
            list: () => apiFetch('/careers'),
            create: (data) => apiFetch('/careers', { method: 'POST', body: JSON.stringify(data) }),
            update: (id, data) => apiFetch(`/careers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`/careers/${id}`, { method: 'DELETE' }),
        }
    }
};

export default API;