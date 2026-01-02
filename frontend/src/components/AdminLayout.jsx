import React from 'react';
import Sidebar from './sidebar';
import Navbar from './Navbar';
import '../pages/styles/admin.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-root">
      <Sidebar />
      <div className="admin-main">
        <Navbar />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
