import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';

const templateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    templateName: {
      type: String,
      required: [true, 'Please provide a template name'],
      trim: true,
      minlength: [2, 'Template name must be at least 2 characters'],
      maxlength: [100, 'Template name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    category: {
      type: String,
      enum: ['personal', 'work', 'student', 'job', 'other'],
      default: 'personal'
    },
    fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
      default: {}
    },
    encryptedFields: {
      type: [String],
      default: []
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    usageCount: {
      type: Number,
      default: 0
    },
    lastUsed: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for better query performance
templateSchema.index({ userId: 1, templateName: 1 });

// Method to encrypt sensitive fields
templateSchema.methods.encryptField = function (fieldName, value) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('Encryption key not found');
  }
  const encrypted = CryptoJS.AES.encrypt(
    value.toString(),
    process.env.ENCRYPTION_KEY
  ).toString();
  
  if (!this.encryptedFields.includes(fieldName)) {
    this.encryptedFields.push(fieldName);
  }
  
  return encrypted;
};

// Method to decrypt sensitive fields
templateSchema.methods.decryptField = function (fieldName, encryptedValue) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('Encryption key not found');
  }
  
  const decrypted = CryptoJS.AES.decrypt(
    encryptedValue,
    process.env.ENCRYPTION_KEY
  );
  
  return decrypted.toString(CryptoJS.enc.Utf8);
};

// Method to get template with decrypted fields
templateSchema.methods.getDecryptedTemplate = function () {
  const template = this.toObject();
  
  if (this.encryptedFields && this.encryptedFields.length > 0) {
    const fields = new Map(template.fields);
    
    this.encryptedFields.forEach(fieldName => {
      if (fields.has(fieldName)) {
        try {
          const decryptedValue = this.decryptField(fieldName, fields.get(fieldName));
          fields.set(fieldName, decryptedValue);
        } catch (error) {
          console.error(`Error decrypting field ${fieldName}:`, error);
        }
      }
    });
    
    template.fields = Object.fromEntries(fields);
  } else {
    template.fields = Object.fromEntries(template.fields);
  }
  
  return template;
};

// Method to increment usage count
templateSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  this.lastUsed = new Date();
  await this.save();
};

const Template = mongoose.model('Template', templateSchema);

export default Template;