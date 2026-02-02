import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useInvoices } from '../context/InvoiceContext';
import { calculateTotals } from '../utils/helpers';
import InvoiceForm from '../Components/InvoiceForm';

export default function Invoices() {
  const { invoices, deleteInvoice } = useInvoices();
  const [filterDate, setFilterDate] = useState('');
  const [statuses, setStatuses] = useState({}); // Local state for status edits
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize statuses on mount
  React.useEffect(() => {
    const initialStatuses = {};
    invoices.forEach(inv => {
      initialStatuses[inv.id] = inv.status || 'Unpaid';
    });
    setStatuses(initialStatuses);
  }, [invoices]);

  const handleStatusChange = (id, newStatus) => {
    setStatuses({ ...statuses, [id]: newStatus });
    // In a real app, update backend; here, just local state (persists until refresh)
  };

  const handleDelete = (id) => {
    deleteInvoice(id);
    toast.success('Invoice deleted successfully!');
  };

  const filteredInvoices = filterDate
    ? invoices.filter(inv => inv.date === filterDate)
    : invoices;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6 transition-all duration-500" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Invoices
        </h2>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
        >
          + Add New Invoice
        </button>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Filter by Date</label>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-3 border-0 rounded-xl bg-white dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-4 py-2 bg-slate-500 text-white rounded-xl shadow-md hover:bg-slate-600 hover:shadow-lg transition-all duration-300"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <tr>
              <th className="p-4 text-left font-bold rounded-tl-2xl">Invoice No</th>
              <th className="p-4 text-left font-bold">Client Name</th>
              <th className="p-4 text-left font-bold">Date</th>
              <th className="p-4 text-left font-bold">Due Date</th>
              <th className="p-4 text-left font-bold">Amount</th>
              <th className="p-4 text-left font-bold">Payment Status</th>
              <th className="p-4 text-left font-bold rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                  No invoices found. Start by adding one!
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const totals = calculateTotals(inv.items);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
                    <td className="p-4 text-slate-900 dark:text-slate-100 font-medium">{inv.number}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-100">{inv.clientName}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-100">{inv.date}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-100">{inv.dueDate || 'N/A'}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-100 font-semibold">₹{totals.grandTotal.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={statuses[inv.id] || 'Unpaid'}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        className="p-2 border-0 rounded-lg bg-slate-100 dark:bg-slate-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="p-4 space-x-3">
                      <Link
                        to={`/preview/${inv.id}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-6xl transform transition-all duration-500 scale-100 hover:scale-105">
            <InvoiceForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}