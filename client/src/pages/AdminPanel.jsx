import React, { useState } from 'react';
import Dashboard from '../admin/Dashboard';
import UserManagement from '../admin/UserManagement';
import ApiUsageChart from '../admin/ApiUsageChart';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', component: <Dashboard /> },
  { id: 'users', label: 'User Management', component: <UserManagement /> },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.component : null;
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="flex space-x-4 mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`px-4 py-2 rounded ${activeTab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default AdminPanel;
