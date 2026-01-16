import React from 'react';
import { X } from 'lucide-react';

const InvoiceItemRow = ({ item, index, onRemove, onChange, errors }) => {
  const itemTotal = (item.quantity * item.price) * (1 + (item.tax || 0) / 100) * (1 - (item.discount || 0) / 100);

  return (
    <div className="grid grid-cols-12 gap-2 mb-2 items-start border-b border-gray-200 dark:border-gray-700 pb-2">
      <div className="col-span-12 md:col-span-4">
        <input
          type="text"
          placeholder="Item Description"
          value={item.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          required
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        />
        {errors[`item_${index}_description`] && <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_description`]}</p>}
      </div>
      <div className="col-span-3 md:col-span-1">
        <input
          type="number"
          placeholder="Qty"
          min="1"
          value={item.quantity}
          onChange={(e) => onChange(index, 'quantity', parseInt(e.target.value) || 1)}
          required
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        />
        {errors[`item_${index}_quantity`] && <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_quantity`]}</p>}
      </div>
      <div className="col-span-4 md:col-span-2">
        <input
          type="number"
          placeholder="Price"
          min="0"
          step="0.01"
          value={item.price}
          onChange={(e) => onChange(index, 'price', parseFloat(e.target.value) || 0)}
          required
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        />
        {errors[`item_${index}_price`] && <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_price`]}</p>}
      </div>
      <div className="col-span-2 md:col-span-1">
        <input
          type="number"
          placeholder="Tax %"
          min="0"
          max="100"
          value={item.tax}
          onChange={(e) => onChange(index, 'tax', parseFloat(e.target.value) || 0)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        />
        {errors[`item_${index}_tax`] && <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_tax`]}</p>}
      </div>
      <div className="col-span-3 md:col-span-2">
        <input
          type="number"
          placeholder="Discount %"
          min="0"
          max="100"
          value={item.discount}
          onChange={(e) => onChange(index, 'discount', parseFloat(e.target.value) || 0)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        />
        {errors[`item_${index}_discount`] && <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_discount`]}</p>}
      </div>
      <div className="col-span-12 md:col-span-2 flex items-center justify-end space-x-2">
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">
          ${itemTotal.toFixed(2)}
        </p>
        <button type="button" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default InvoiceItemRow;