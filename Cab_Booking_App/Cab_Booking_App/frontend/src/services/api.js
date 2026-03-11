import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API Request:', config.method.toUpperCase(), config.url, 'Token attached');
    } else {
        console.warn('API Request:', config.method.toUpperCase(), config.url, 'No token found in localStorage');
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const rideService = {
    bookRide: (rideData) => api.post('/rides/book', rideData),
    acceptRide: (rideId) => api.put(`/rides/accept/${rideId}`),
    getRequestedRides: () => api.get('/rides/requests'),
    getRiderHistory: () => api.get('/rides/history/rider'),
    getDriverHistory: () => api.get('/rides/history/driver'),
};

export const paymentService = {
    createIntent: (rideId) => api.post(`/payments/create-intent/${rideId}`),
    confirmPayment: (rideId, method) => api.post(`/payments/confirm/${rideId}?method=${method}`),
    initiatePhonePe: (rideId) => api.post(`/payments/phonepe/initiate/${rideId}`)
};

export const ratingService = {
    submitRating: (ratingData) => api.post('/ratings/submit', ratingData),
};

export default api;
