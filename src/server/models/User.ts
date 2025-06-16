import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  language: string;
  notification_settings: {
    emailAlerts: boolean;
    missionUpdates: boolean;
    weeklyReports: boolean;
    systemAlerts: boolean;
    newClients: boolean;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, required: true, default: 'user' },
  language: { type: String, required: true, default: 'fr' },
  notification_settings: {
    emailAlerts: { type: Boolean, default: true },
    missionUpdates: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    systemAlerts: { type: Boolean, default: false },
    newClients: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model<IUser>('User', UserSchema); 