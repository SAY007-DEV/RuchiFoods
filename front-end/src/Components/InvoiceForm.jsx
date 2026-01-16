import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useInvoices } from '../context/InvoiceContext';
import InvoiceItemRow from './InvoiceItemRow';
import { calculateTotals } from '../utils/helpers';

export default function InvoiceForm() {
  const { addInvoice } = useInvoices();
  const navigate = useNavigate();
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
      navigate('/invoices');
    } else {
      toast.error('Please fix the errors and try again.');
    }
  };

  const totals = calculateTotals(formData.items);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Company Details */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">Company Details (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              name="companyEmail"
              type="email"
              placeholder="Company Email"
              value={formData.companyEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.companyEmail && <p className="text-red-500 text-sm">{errors.companyEmail}</p>}
          </div>
          <div>
            <textarea
              name="companyAddress"
              placeholder="Company Address"
              value={formData.companyAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              name="companyPhone"
              placeholder="Company Phone"
              value={formData.companyPhone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.companyPhone && <p className="text-red-500 text-sm">{errors.companyPhone}</p>}
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">Client Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              name="clientName"
              placeholder="Client Name"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName}</p>}
          </div>
          <div>
            <textarea
              name="clientDetails"
              placeholder="Client Details"
              value={formData.clientDetails}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div>
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">Items</h3>
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
        {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}
        <button type="button" onClick={addItem} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Item
        </button>
      </div>

      {/* Notes and Terms */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="terms"
            placeholder="Terms"
            value={formData.terms}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gray-50 p-4 rounded text-right">
        <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
        <p>Tax: ${totals.totalTax.toFixed(2)}</p>
        <p>Discount: ${totals.totalDiscount.toFixed(2)}</p>
        <p className="font-bold">Grand Total: ${totals.grandTotal.toFixed(2)}</p>
        {errors.totals && <p className="text-red-500 text-sm">{errors.totals}</p>}
      </div>

      <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Create Invoice
      </button>
    </form>
  );
}