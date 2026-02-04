import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0, max: 100 },
    discount: { type: Number, default: 0, min: 0, max: 100 }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },

    companyName: String,
    companyAddress: String,
    companyEmail: String,
    companyPhone: String,

    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    clientName: { type: String, required: true, trim: true },
    clientDetails: String,

    date: { type: String, required: true },
    dueDate: { type: String },

    notes: String,
    terms: String,

    items: { type: [itemSchema], default: [] },

    subtotal: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },

    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Overdue', 'Pending'],
      default: 'Unpaid'
    }
  },
  { timestamps: true }
);

invoiceSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Invoice', invoiceSchema);
