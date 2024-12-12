import React from 'react';
import './Statistics.css';

const Statistics = ({ totalUsers, recentUsers }) => {
  return (
    <div className="statistics-container">
      <div className="stat-card">
        <h3>Total Users</h3>
        <p>{totalUsers}</p>
      </div>
      <div className="stat-card">
        <h3>Recent Users</h3>
        <p>{recentUsers}</p>
      </div>
      {/* Add more statistics as needed */}
    </div>
  );
};

export default Statistics;
