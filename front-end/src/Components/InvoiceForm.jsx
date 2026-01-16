import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useInvoices } from '../context/InvoiceContext';
import InvoiceItemRow from './InvoiceItemRow';
import { calculateTotals } from '../utils/helpers';

export default function InvoiceForm({ onClose }) {
  const { addInvoice } = useInvoices();
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    clientName: '',
    clientDetails: '',
    date: '',
    dueDate: '',
    notes: '',
    terms: '',
    items: [{ description: '', quantity: 1, price: 0, tax: 0, discount: 0 }]
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
    // Clear item errors
    const itemKey = `item_${index}_${field}`;
    if (errors[itemKey]) {
      setErrors({ ...errors, [itemKey]: '' });
    }
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, price: 0, tax: 0, discount: 0 }] });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    } else {
      setErrors({ ...errors, items: 'At least one item is required.' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Company fields (optional but validate if filled)
    if (formData.companyEmail && !/\S+@\S+\.\S+/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Invalid email format.';
    }
    if (formData.companyPhone && !/^\d{10,}$/.test(formData.companyPhone.replace(/\D/g, ''))) {
      newErrors.companyPhone = 'Phone must be at least 10 digits.';
    }
    // Required fields
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required.';
    if (!formData.date) newErrors.date = 'Invoice date is required.';
    if (formData.dueDate && new Date(formData.dueDate) <= new Date(formData.date)) {
      newErrors.dueDate = 'Due date must be after invoice date.';
    }
    // Items validation
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) newErrors[`item_${index}_description`] = 'Description is required.';
      if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0.';
      if (item.price < 0) newErrors[`item_${index}_price`] = 'Price cannot be negative.';
      if (item.tax < 0 || item.tax > 100) newErrors[`item_${index}_tax`] = 'Tax must be 0-100%.';
      if (item.discount < 0 || item.discount > 100) newErrors[`item_${index}_discount`] = 'Discount must be 0-100%.';
    });
    if (formData.items.length === 0) newErrors.items = 'At least one item is required.';
    // Totals check
    const totals = calculateTotals(formData.items);
    if (totals.grandTotal < 0) newErrors.totals = 'Grand total cannot be negative.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      addInvoice(formData);
      toast.success('Invoice created successfully!');
      onClose();
    } else {
      toast.error('Please fix the errors and try again.');
    }
  };

  const totals = calculateTotals(formData.items);

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4">
        {/* Company Details */}
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Company Details (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <input
                name="companyEmail"
                type="email"
                placeholder="Company Email"
                value={formData.companyEmail}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.companyEmail && <p className="text-red-500 text-sm mt-1">{errors.companyEmail}</p>}
            </div>
            <div>
              <textarea
                name="companyAddress"
                placeholder="Company Address"
                value={formData.companyAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <input
                name="companyPhone"
                placeholder="Company Phone"
                value={formData.companyPhone}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.companyPhone && <p className="text-red-500 text-sm mt-1">{errors.companyPhone}</p>}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Client Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="clientName"
                placeholder="Client Name"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
              {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
            </div>
            <div>
              <textarea
                name="clientDetails"
                placeholder="Client Details (Address, etc.)"
                value={formData.clientDetails}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Invoice Date</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Due Date</label>
              <input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Items</h3>
          {formData.items.map((item, index) => (
            <InvoiceItemRow
              key={index}
              item={item}
              index={index}
              onChange={handleItemChange}
              onRemove={removeItem}
              errors={errors}
            />
          ))}
          {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
          <button type="button" onClick={addItem} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Item
          </button>
        </div>

        {/* Notes and Terms */}
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <textarea
              name="terms"
              placeholder="Terms & Conditions"
              value={formData.terms}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Totals */}
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg text-right space-y-1 text-gray-800 dark:text-gray-200">
          <p>Subtotal: <span className="font-semibold">${totals.subtotal.toFixed(2)}</span></p>
          <p>Tax: <span className="font-semibold">${totals.totalTax.toFixed(2)}</span></p>
          <p>Discount: <span className="font-semibold">-${totals.totalDiscount.toFixed(2)}</span></p>
          <p className="font-bold text-lg">Grand Total: <span className="font-extrabold">${totals.grandTotal.toFixed(2)}</span></p>
          {errors.totals && <p className="text-red-500 text-sm">{errors.totals}</p>}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create Invoice
            </button>
        </div>
      </form>
    </>
  );
}