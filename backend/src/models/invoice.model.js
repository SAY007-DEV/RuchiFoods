import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }
});

const invoiceSchema = new mongoose.Schema(
  {
    companyName: String,
    companyAddress: String,
    companyEmail: String,
    companyPhone: String,

    clientName: { type: String, required: true },
    clientDetails: String,

    date: { type: Date, required: true },
    dueDate: Date,

    notes: String,
    terms: String,

    items: [itemSchema],

    subtotal: Number,
    totalTax: Number,
    totalDiscount: Number,
    grandTotal: Number
  },
  { timestamps: true }
);

export default mongoose.model('Invoice', invoiceSchema);
