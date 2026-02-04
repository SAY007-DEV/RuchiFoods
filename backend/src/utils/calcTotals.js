export const calculateTotals = (items = []) => {
  const subtotal = items.reduce((acc, item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return acc + quantity * price;
  }, 0);

  const totalTax = items.reduce((acc, item) => {
    const itemTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0);
    const taxAmount = itemTotal * ((Number(item.tax) || 0) / 100);
    return acc + taxAmount;
  }, 0);

  const totalDiscount = items.reduce((acc, item) => {
    const itemTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0);
    const discountAmount = itemTotal * ((Number(item.discount) || 0) / 100);
    return acc + discountAmount;
  }, 0);

  const grandTotal = subtotal + totalTax - totalDiscount;

  return { subtotal, totalTax, totalDiscount, grandTotal };
};
