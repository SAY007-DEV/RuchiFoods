const INVOICES_KEY = 'ruchi_invoices_data';
const COMPANY_KEY = 'ruchi_company_settings';

// --- Invoice Storage ---

export const getStoredInvoices = () => {
  try {
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load invoices:', error);
    return [];
  }
};

export const saveStoredInvoices = (invoices) => {
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (error) {
    console.error('Failed to save invoices:', error);
  }
};

// --- Company Details Storage ---

export const getStoredCompanyDetails = () => {
  try {
    const data = localStorage.getItem(COMPANY_KEY);
    // Default details if nothing is saved yet
    return data ? JSON.parse(data) : {
      companyName: 'Ruchi Foods',
      companyAddress: '',
      companyEmail: '',
      companyPhone: ''
    };
  } catch (error) {
    console.error('Failed to load company details:', error);
    return {};
  }
};

export const saveStoredCompanyDetails = (details) => {
  try {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(details));
  } catch (error) {
    console.error('Failed to save company details:', error);
  }
};