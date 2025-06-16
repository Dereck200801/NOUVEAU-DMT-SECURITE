import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

const CompanySchema: Schema = new Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  taxId: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ICompany>('Company', CompanySchema); 