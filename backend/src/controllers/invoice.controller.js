import { saveInvoice, fetchInvoices } from '../services/invoice.service.js';

export const createInvoice = async (req, res) => {
  try {
    const invoice = req.body;

    const savedInvoice = await saveInvoice(invoice);

    res.status(201).json({
      success: true,
      message: 'Invoice saved successfully',
      data: savedInvoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await fetchInvoices();
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
