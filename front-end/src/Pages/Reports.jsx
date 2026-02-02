import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports = () => {
  // State for invoices data, loading, error, and filters
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch invoices from API
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/invoices'); // Adjust endpoint as needed
      setInvoices(response.data);
      calculateTotalRevenue(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch invoices. Please try again.');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total revenue from invoices
  const calculateTotalRevenue = (data) => {
    const total = data.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    setTotalRevenue(total);
  };

  // Filter invoices based on search, date range, and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toString().includes(searchTerm);
    const matchesDate =
      (!dateFrom || new Date(invoice.date) >= new Date(dateFrom)) &&
      (!dateTo || new Date(invoice.date) <= new Date(dateTo));
    const matchesStatus = !statusFilter || invoice.paymentStatus === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Recalculate total revenue when filters change
  useEffect(() => {
    calculateTotalRevenue(filteredInvoices);
  }, [filteredInvoices]);

  // Download PDF report
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Invoice Reports', 20, 10);
    const tableColumn = [
      'Invoice Number', 'Client Name', 'Date', 'Due Date', 'Total Amount', 'Payment Status'
    ];
    const tableRows = filteredInvoices.map(invoice => [
      invoice.number,
      invoice.clientName,
      invoice.date,
      invoice.dueDate || 'N/A',
      `₹${invoice.totalAmount.toFixed(2)}`,
      invoice.paymentStatus
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('invoice-reports.pdf');
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredInvoices.map(invoice => ({
      'Invoice ID': invoice.id,
      'Invoice Number': invoice.number,
      'Client Name': invoice.clientName,
      'Client Email': invoice.clientEmail,
      'Client Address': invoice.clientAddress,
      'Invoice Date': invoice.date,
      'Due Date': invoice.dueDate || 'N/A',
      'Items': invoice.items.map(item => `${item.name} (Qty: ${item.quantity}, Price: ₹${item.price})`).join('; '),
      'Subtotal': `₹${invoice.subtotal.toFixed(2)}`,
      'Tax': `₹${invoice.tax.toFixed(2)}`,
      'Discount': `₹${invoice.discount.toFixed(2)}`,
      'Total Amount': `₹${invoice.totalAmount.toFixed(2)}`,
      'Payment Status': invoice.paymentStatus,
      'Payment Method': invoice.paymentMethod || 'N/A',
      'Created By': invoice.createdBy
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    XLSX.writeFile(workbook, 'invoice-reports.xlsx');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6 transition-all duration-500" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Invoice Reports
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            Download PDF
          </button>
          <button
            onClick={exportToExcel}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by client name or invoice number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border-0 rounded-xl bg-white dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
        />
        <input
          type="date"
          placeholder="From Date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="p-3 border-0 rounded-xl bg-white dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
        />
        <input
          type="date"
          placeholder="To Date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="p-3 border-0 rounded-xl bg-white dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border-0 rounded-xl bg-white dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-all duration-300"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Total Revenue Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Total Revenue: ₹{totalRevenue.toFixed(2)}</h3>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading reports...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 font-semibold">{error}</p>
          <button
            onClick={fetchInvoices}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Invoices Table */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                <th className="p-4 text-left font-bold rounded-tl-2xl">Invoice Number</th>
                <th className="p-4 text-left font-bold">Client Name</th>
                <th className="p-4 text-left font-bold">Date</th>
                <th className="p-4 text-left font-bold">Due Date</th>
                <th className="p-4 text-left font-bold">Total Amount</th>
                <th className="p-4 text-left font-bold rounded-tr-2xl">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                    No invoices match the filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
                    <td className="p-4 text-slate-900 dark:text-slate-100 font-medium">{invoice.number}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-100">{invoice.clientName}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-100">{invoice.date}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-100">{invoice.dueDate || 'N/A'}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-100 font-semibold">₹{invoice.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          invoice.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.paymentStatus === 'Unpaid'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;