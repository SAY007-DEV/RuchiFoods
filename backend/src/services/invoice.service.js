import Invoice from '../models/invoice.model.js';
import { calculateTotals } from '../utils/calcTotals.js';

const generateInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
  const lastNumber = lastInvoice?.number || '';
  const match = /INV-(\d+)/.exec(lastNumber);
  const nextNumber = match ? Number(match[1]) + 1 : (await Invoice.countDocuments()) + 1;
  return `INV-${String(nextNumber).padStart(4, '0')}`;
};

export const createInvoice = async (invoiceData) => {
  const totals = calculateTotals(invoiceData.items || []);
  const number = invoiceData.number || (await generateInvoiceNumber());

  const invoice = await Invoice.create({
    ...invoiceData,
    number,
    paymentStatus: invoiceData.paymentStatus || 'Unpaid',
    ...totals
  });

  return invoice;
};

export const fetchInvoices = async () => {
  return Invoice.find().sort({ createdAt: -1 });
};

export const deleteInvoiceById = async (id) => {
  return Invoice.findByIdAndDelete(id);
};

export const updateInvoiceStatus = async (id, paymentStatus) => {
  return Invoice.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true }
  );
};
