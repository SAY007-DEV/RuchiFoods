import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useInvoices } from '../context/InvoiceContext'; // Assuming clients are managed here

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useInvoices(); // Adjust based on your context
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  // Filtered and sorted clients
  const filteredClients = (clients || [])
    .filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'email') return a.email.localeCompare(b.email);
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required.';
    if (!formData.phone.trim() || !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Valid phone number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editingClient) {
        updateClient(editingClient.id, formData);
        toast.success('Client updated successfully!');
      } else {
        addClient({ ...formData, id: Date.now(), createdAt: new Date().toISOString() });
        toast.success('Client added successfully!');
      }
      setIsModalOpen(false);
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    } else {
      toast.error('Please fix the errors.');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
      toast.success('Client deleted successfully!');
    }
  };

  const openAddModal = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6 transition-all duration-500" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manage Clients
        </h2>
        <button 
          onClick={openAddModal} 
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
        >
          + Add Client
        </button>
      </div>

      {/* Search and Sort */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border-0 rounded-xl bg-white dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 border-0 rounded-xl bg-white dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="createdAt">Sort by Date Added</option>
        </select>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <tr>
              <th className="p-4 text-left font-bold rounded-tl-2xl">Name</th>
              <th className="p-4 text-left font-bold">Email</th>
              <th className="p-4 text-left font-bold">Phone</th>
              <th className="p-4 text-left font-bold">Address</th>
              <th className="p-4 text-left font-bold rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                  No clients found. Add one to get started!
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
                  <td className="p-4 text-slate-900 dark:text-slate-100 font-medium">{client.name}</td>
                  <td className="p-4 text-slate-900 dark:text-slate-100">{client.email}</td>
                  <td className="p-4 text-slate-900 dark:text-slate-100">{client.phone}</td>
                  <td className="p-4 text-slate-900 dark:text-slate-100">{client.address || 'N/A'}</td>
                  <td className="p-4 space-x-3">
                    <Link
                      to={`/invoices?client=${client.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300 font-medium"
                    >
                      View Invoices
                    </Link>
                    <button
                      onClick={() => handleEdit(client)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all duration-300 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-500 scale-100 hover:scale-105">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-3xl leading-none hover:scale-110 transition-all duration-300"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  name="name"
                  placeholder="Client Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Client Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full p-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </div>
              <div>
                <input
                  name="phone"
                  placeholder="Client Phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full p-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
              </div>
              <div>
                <textarea
                  name="address"
                  placeholder="Client Address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full p-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300 resize-none"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl shadow-md hover:bg-slate-300 dark:hover:bg-slate-500 hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                >
                  {editingClient ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}