import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import InvoiceForm from './InvoiceForm';


const statsData = [
  {
    title: 'Total Invoices',
    value: '1,234',
    description: 'Invoices created this month',
    icon: FileText,
    color: 'text-blue-600',
  },
  {
    title: 'Total Revenue',
    value: '$45,678',
    description: 'Revenue generated',
    icon: DollarSign,
    color: 'text-green-600',
  },
  {
    title: 'Outstanding Amount',
    value: '$12,345',
    description: 'Amount yet to be paid',
    icon: AlertCircle,
    color: 'text-yellow-600',
  },
  {
    title: 'Paid Invoices',
    value: '987',
    description: 'Invoices fully paid',
    icon: CheckCircle,
    color: 'text-green-600',
  },
];


const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 25000 },
  { month: 'Jun', revenue: 28000 },
];


const statusData = [
  { name: 'Paid', value: 60, color: '#10B981' }, 
  { name: 'Pending', value: 30, color: '#F59E0B' }, 
  { name: 'Overdue', value: 10, color: '#EF4444' }, 
];


const recentInvoices = [
  { id: 'INV-001', client: 'Acme Corp', date: '2023-10-01', amount: '$1,200', status: 'Paid' },
  { id: 'INV-002', client: 'Tech Solutions', date: '2023-10-05', amount: '$800', status: 'Pending' },
  { id: 'INV-003', client: 'Global Ltd', date: '2023-10-10', amount: '$2,500', status: 'Overdue' },
  { id: 'INV-004', client: 'Startup Inc', date: '2023-10-15', amount: '$1,500', status: 'Paid' },
  { id: 'INV-005', client: 'Enterprise Co', date: '2023-10-20', amount: '$3,000', status: 'Pending' },
];


const StatsCard = ({ title, value, description, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <Icon className={`h-8 w-8 ${color}`} />
    </div>
  </div>
);


const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
    {children}
  </div>
);


const InvoiceTable = ({ invoices }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice #</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{invoice.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{invoice.client}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{invoice.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{invoice.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">View</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


export default function Dashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
 
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const subtitle = `Overview for ${currentMonth} ${currentYear}`;

 
  useEffect(() => {
    toast.success('Welcome to your Dashboard!');
  }, []);

 
  const handleCreateInvoice = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
     
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
          </div>
          <button
            onClick={handleCreateInvoice}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
       
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

       
        <ChartCard title="Invoice Status Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

     
      <InvoiceTable invoices={recentInvoices} />

      
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-5xl transform transition-all">
            <InvoiceForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}