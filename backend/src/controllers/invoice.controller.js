import {
  createInvoice as createInvoiceService,
  fetchInvoices,
  deleteInvoiceById,
  updateInvoiceStatus
} from '../services/invoice.service.js';

export const createInvoice = async (req, res) => {
  try {
    const invoice = await createInvoiceService(req.body);
    res.status(201).json({
      success: true,
      message: 'Invoice saved successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInvoices = async (_req, res) => {
  try {
    const invoices = await fetchInvoices();
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const deleted = await deleteInvoiceById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const updated = await updateInvoiceStatus(req.params.id, paymentStatus);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
