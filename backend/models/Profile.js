import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    profileName: {
      type: String,
      required: [true, 'Please provide a profile name'],
      trim: true,
      minlength: [2, 'Profile name must be at least 2 characters'],
      maxlength: [50, 'Profile name cannot exceed 50 characters']
    },
    profileType: {
      type: String,
      enum: ['personal', 'work', 'student', 'freelance', 'other'],
      default: 'personal'
    },
    icon: {
      type: String,
      default: '👤'
    },
    color: {
      type: String,
      default: '#00D9FF'
    },
    templates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
      }
    ],
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Create compound index
profileSchema.index({ userId: 1, profileName: 1 });

// Ensure only one default profile per user
profileSchema.pre('save', async function (next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await mongoose.model('Profile').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Method to add template to profile
profileSchema.methods.addTemplate = async function (templateId) {
  if (!this.templates.includes(templateId)) {
    this.templates.push(templateId);
    await this.save();
  }
};

// Method to remove template from profile
profileSchema.methods.removeTemplate = async function (templateId) {
  this.templates = this.templates.filter(
    id => id.toString() !== templateId.toString()
  );
  await this.save();
};

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;