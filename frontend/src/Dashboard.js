import React, { useState, useEffect } from 'react';
import Header from './Header';
import Statistics from './Statistics';
import SearchBar from './SearchBar';
import UserList from './UserList';
import UserForm from './UserForm';
import { getUsers, createUser, updateUser, deleteUser } from './api';
import './Dashboard.css';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: ''
  });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      console.log("Fetched users:", response);
      if (Array.isArray(response)) {
        setUsers(response);
      } else {
        console.error('Expected an array but received:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email || !formData.address) {
      setError("All fields are required!");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Phone Number must be a valid 10-digit number");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    // If validation passes, clear any error messages
    setError('');

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
    };

    try {
      if (editingId) {
        const updatedUser = await updateUser(editingId, userData);
        setUsers(users.map(user => (user.id === editingId ? updatedUser : user)));
        setEditingId(null);
      } else {
        const newUser = await createUser(userData);
        setUsers([...users, newUser]); 
      }

      setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '', address: '' });
      setError('');
    } catch (error) {
      console.error('Error:', error);
        // Check if the error is related to an existing user
        if (error.message.includes("User with this email already exists")) {
            setError('User already exists'); // Update error message
        } else {
            setError('Failed to submit user data'); // Default error message for other cases
        }
    }
  };

  const handleEdit = (user) => {
    setFormData({
      firstName: user.first_name, 
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      email: user.email,
      address: user.address,
    });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredUsers = users.filter(user =>
    (user.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone_number || '').toString().includes(searchTerm) // Convert phone number to string
  ) || [];
  
  const calculateRecentUsers = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calculate date one week ago

    return users.filter(user => {
      const createdAt = new Date(user.created_at); // Assuming you have a createdAt field
      return createdAt >= oneWeekAgo;
    }).length;
  };

  return (
    <div className="dashboard-container">
      <Header />
      <Statistics totalUsers={users.length} recentUsers={calculateRecentUsers()} />
      <SearchBar handleSearch={handleSearch} />
      <div className="main-content">
        <UserForm 
          handleSubmit={handleSubmit} 
          formData={formData} 
          handleChange={handleChange} 
          editingId={editingId}
        />
        <UserList users={filteredUsers} handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
      {error && <p className="error-message">{error}</p>}
      {filteredUsers.length === 0 && <p>No users found.</p>}
    </div>
  );
};

export default Dashboard;
