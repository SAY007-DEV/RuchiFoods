import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useInvoices } from '../context/InvoiceContext';
import { calculateTotals } from '../utils/helpers';

// InvoiceForm component (should be extracted to its own file to avoid duplication)
const InvoiceForm = ({ onClose }) => {
  const { addInvoice } = useInvoices();
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return; // Prevent removing the last item
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      clientName,
      date,
      items,
      status: 'Unpaid',
    };
    addInvoice(newInvoice);
    toast.success('Invoice created successfully!');
    onClose();
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Items</h3>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
            <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} required className="col-span-6 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
            <input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} required className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
            <input type="number" placeholder="Price" min="0" step="0.01" value={item.price} onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} required className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
            <div className="col-span-2 flex justify-end">
              {items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">Remove</button>}
            </div>
          </div>
        ))}
        <button type="button" onClick={addItem} className="mb-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Add Item</button>

        <div className="flex justify-end space-x-4 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Invoice</button>
        </div>
      </form>
    </div>
  );
};

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h2>
        <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Add New Invoice
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Filter by Date</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="ml-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Filter
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Invoice No</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Client Name</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Date</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Due Date</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Amount</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Payment Status</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500 dark:text-gray-400">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const totals = calculateTotals(inv.items);
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 text-gray-900 dark:text-white">{inv.number}</td>
                    <td className="p-3 text-gray-900 dark:text-white">{inv.clientName}</td>
                    <td className="p-3 text-gray-900 dark:text-white">{inv.date}</td>
                    <td className="p-3 text-gray-900 dark:text-white">{inv.dueDate || 'N/A'}</td>
                    <td className="p-3 text-gray-900 dark:text-white">${totals.grandTotal.toFixed(2)}</td>
                    <td className="p-3">
                      <select
                        value={statuses[inv.id] || 'Unpaid'}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        className="p-1 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="p-3 space-x-2">
                      <Link
                        to={`/preview/${inv.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-3xl transform transition-all">
            <InvoiceForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}