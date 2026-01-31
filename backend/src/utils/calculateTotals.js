export const calculateTotals = (items) => {
  let subtotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;

  items.forEach(item => {
    const itemTotal = item.quantity * item.price;
    subtotal += itemTotal;
    totalTax += (itemTotal * item.tax) / 100;
    totalDiscount += (itemTotal * item.discount) / 100;
  });

  const grandTotal = subtotal + totalTax - totalDiscount;

  return { subtotal, totalTax, totalDiscount, grandTotal };
};
