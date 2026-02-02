import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useInvoices } from '../context/InvoiceContext';
import InvoiceItemRow from './InvoiceItemRow';
import { calculateTotals } from '../utils/helpers';

export default function InvoiceForm({ onClose }) {
  const { addInvoice, companyDetails, saveCompanySettings } = useInvoices();
  const [formData, setFormData] = useState({
    companyName: companyDetails?.companyName || '',
    companyAddress: companyDetails?.companyAddress || '',
    companyEmail: companyDetails?.companyEmail || '',
    companyPhone: companyDetails?.companyPhone || '',
    clientName: '',
    clientDetails: '',
    date: new Date().toISOString().split('T')[0], // Prefill with current date
    dueDate: '',
    notes: '',
    terms: '',
    items: [{ description: '', quantity: 1, price: 0, tax: 0, discount: 0 }]
  });
  const [errors, setErrors] = useState({});

  // Prefill company details on mount or when companyDetails changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      companyName: companyDetails?.companyName || '',
      companyAddress: companyDetails?.companyAddress || '',
      companyEmail: companyDetails?.companyEmail || '',
      companyPhone: companyDetails?.companyPhone || '',
    }));
  }, [companyDetails]);

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
      
      // Save company details for future use
      saveCompanySettings({
        companyName: formData.companyName,
        companyAddress: formData.companyAddress,
        companyEmail: formData.companyEmail,
        companyPhone: formData.companyPhone
      });

      toast.success('Invoice created successfully!');
      onClose();
    } else {
      toast.error('Please fix the errors and try again.');
    }
  };

  const totals = calculateTotals(formData.items);

  return (
    <>
      <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-slate-700">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create New Invoice
        </h2>
        <button 
          onClick={onClose} 
          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-4xl leading-none hover:scale-110 transition-all duration-300"
        >
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto pr-4">
        {/* Company Details */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold mb-4 text-slate-900 dark:text-slate-100 text-lg">Company Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
              />
            </div>
            <div>
              <input
                name="companyEmail"
                type="email"
                placeholder="Company Email"
                value={formData.companyEmail}
                onChange={handleChange}
                className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
              />
              {errors.companyEmail && <p className="text-red-500 text-sm mt-2">{errors.companyEmail}</p>}
            </div>
            <div>
              <textarea
                name="companyAddress"
                placeholder="Company Address"
                value={formData.companyAddress}
                onChange={handleChange}
                className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300 resize-none"
                rows="3"
              />
            </div>
            <div>
              <input
                name="companyPhone"
                placeholder="Company Phone"
                value={formData.companyPhone}
                onChange={handleChange}
                className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
              />
              {errors.companyPhone && <p className="text-red-500 text-sm mt-2">{errors.companyPhone}</p>}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold mb-4 text-slate-900 dark:text-slate-100 text-lg">Client Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                name="clientName"
                placeholder="Client Name"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
                required
              />
              {errors.clientName && <p className="text-red-500 text-sm mt-2">{errors.clientName}</p>}
            </div>
            <div>
              <textarea
                name="clientDetails"
                placeholder="Client Details (Address, etc.)"
                value={formData.clientDetails}
                onChange={handleChange}
                className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300 resize-none"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Invoice Date</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
                required
              />
              {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Due Date</label>
              <input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-2">{errors.dueDate}</p>}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold mb-4 text-slate-900 dark:text-slate-100 text-lg">Items</h3>
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
          {errors.items && <p className="text-red-500 text-sm mt-2">{errors.items}</p>}
          <button 
            type="button" 
            onClick={addItem} 
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            + Add Item
          </button>
        </div>

        {/* Notes and Terms */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold mb-4 text-slate-900 dark:text-slate-100 text-lg">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300 resize-none"
              rows="4"
            />
            <textarea
              name="terms"
              placeholder="Terms & Conditions"
              value={formData.terms}
              onChange={handleChange}
              className="w-full p-3 border-0 rounded-xl bg-white dark:bg-slate-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300 resize-none"
              rows="4"
            />
          </div>
        </div>

        {/* Totals */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-lg text-right space-y-2 text-slate-800 dark:text-slate-200">
          <p className="text-lg">Subtotal: <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span></p>
          <p className="text-lg">Tax: <span className="font-semibold">₹{totals.totalTax.toFixed(2)}</span></p>
          <p className="text-lg">Discount: <span className="font-semibold">-₹{totals.totalDiscount.toFixed(2)}</span></p>
          <p className="font-bold text-xl">Grand Total: <span className="font-extrabold text-2xl">₹{totals.grandTotal.toFixed(2)}</span></p>
          {errors.totals && <p className="text-red-500 text-sm">{errors.totals}</p>}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t dark:border-slate-700">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl shadow-md hover:bg-slate-300 dark:hover:bg-slate-500 hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </>
  );
}