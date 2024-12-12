/// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust this to your backend URL

// Create an Axios instance for easier management
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Create a user
export const createUser = async (user) => {
    try {
        const response = await apiClient.post('/users', user);
        return response.data; // Return the created user
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error creating user');
    }
};

// Get all users
export const getUsers = async () => {
    try {
        const response = await apiClient.get('/users');
        return response.data; // Return the list of users
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error fetching users');
    }
};

// Update a user by ID
export const updateUser = async (id, user) => {
    try {
        const response = await apiClient.put(`/users/${id}`, user);
        return response.data; // Return the updated user
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error updating user');
    }
};

// Delete a user by ID
export const deleteUser = async (id) => {
    try {
        await apiClient.delete(`/users/${id}`);
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error deleting user');
    }
};
