import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  role: 'general_director' | 'project_engineer' | 'purchasing_manager' | 'logistics_manager' | 'admin';
  email?: string;
  permissions: Array<{
    module: 'dashboard' | 'projects' | 'purchasing' | 'logistics' | 'reports';
    actions: Array<'read' | 'write' | 'delete' | 'approve'>;
  }>;
  preferences: {
    theme: string;
    language: 'fr' | 'ar' | 'en';
    notifications: boolean;
    currency: string;
    timezone: string;
  };
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    department?: string;
    position?: string;
    company?: string;
  };
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    required: true,
    enum: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager', 'admin'],
    default: 'project_engineer'
  },
  permissions: [{
    module: { 
      type: String, 
      enum: ['dashboard', 'projects', 'purchasing', 'logistics', 'reports'] 
    },
    actions: [{ 
      type: String, 
      enum: ['read', 'write', 'delete', 'approve'] 
    }]
  }],
  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, enum: ['fr', 'ar', 'en'], default: 'fr' },
    notifications: { type: Boolean, default: true },
    currency: { type: String, default: 'MAD' },
    timezone: { type: String, default: 'Africa/Casablanca' }
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    department: String,
    position: String,
    company: String
  },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<IUser>('User', UserSchema);
