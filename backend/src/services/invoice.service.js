import { readData, writeData } from '../utils/fileStorage.js';
import { v4 as uuid } from 'uuid';

export const saveInvoice = async (invoiceData) => {
  const invoices = await readData();

  const newInvoice = {
    id: uuid(),
    ...invoiceData,
    createdAt: new Date().toISOString()
  };

  invoices.push(newInvoice);
  await writeData(invoices);

  return newInvoice;
};

export const fetchInvoices = async () => {
  return await readData();
};
