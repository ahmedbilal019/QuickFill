import Profile from '../models/Profile.js';
import Template from '../models/Template.js';
import { validateObjectId } from '../utils/validation.js';

// @desc    Get all profiles for logged-in user
// @route   GET /api/profiles
// @access  Private
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.user._id })
      .populate('templates', 'templateName category')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    console.error('Get Profiles Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profiles'
    });
  }
};

// @desc    Get single profile by ID
// @route   GET /api/profiles/:id
// @access  Private
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    const idValidation = validateObjectId(id);
    if (!idValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: idValidation.message
      });
    }

    const profile = await Profile.findOne({
      _id: id,
      userId: req.user._id
    }).populate('templates');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Create new profile
// @route   POST /api/profiles
// @access  Private
export const createProfile = async (req, res) => {
  try {
    const { profileName, profileType, icon, color, templates, isDefault } = req.body;

    // Validate profile name
    if (!profileName || profileName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Profile name must be at least 2 characters'
      });
    }

    // Check if profile with same name exists
    const existingProfile = await Profile.findOne({
      userId: req.user._id,
      profileName: profileName.trim()
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile with this name already exists'
      });
    }

    // Validate template IDs if provided
    if (templates && templates.length > 0) {
      for (const templateId of templates) {
        const idValidation = validateObjectId(templateId);
        if (!idValidation.isValid) {
          return res.status(400).json({
            success: false,
            message: `Invalid template ID: ${templateId}`
          });
        }

        // Check if template belongs to user
        const template = await Template.findOne({
          _id: templateId,
          userId: req.user._id
        });

        if (!template) {
          return res.status(404).json({
            success: false,
            message: `Template not found: ${templateId}`
          });
        }
      }
    }

    // Get max order value
    const maxOrderProfile = await Profile.findOne({ userId: req.user._id })
      .sort({ order: -1 })
      .limit(1);

    const order = maxOrderProfile ? maxOrderProfile.order + 1 : 0;

    // Create profile
    const profile = await Profile.create({
      userId: req.user._id,
      profileName: profileName.trim(),
      profileType: profileType || 'personal',
      icon: icon || '👤',
      color: color || '#00D9FF',
      templates: templates || [],
      isDefault: isDefault || false,
      order
    });

    await profile.populate('templates', 'templateName category');

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    console.error('Create Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating profile'
    });
  }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileName, profileType, icon, color, isDefault, isActive, order } = req.body;

    // Validate ObjectId
    const idValidation = validateObjectId(id);
    if (!idValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: idValidation.message
      });
    }

    const profile = await Profile.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Validate profile name if provided
    if (profileName) {
      if (profileName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Profile name must be at least 2 characters'
        });
      }

      // Check if another profile with same name exists
      const existingProfile = await Profile.findOne({
        userId: req.user._id,
        profileName: profileName.trim(),
        _id: { $ne: id }
      });

      if (existingProfile) {
        return res.status(400).json({
          success: false,
          message: 'Another profile with this name already exists'
        });
      }

      profile.profileName = profileName.trim();
    }

    if (profileType) profile.profileType = profileType;
    if (icon) profile.icon = icon;
    if (color) profile.color = color;
    if (isActive !== undefined) profile.isActive = isActive;
    if (order !== undefined) profile.order = order;

    if (isDefault !== undefined) {
      profile.isDefault = isDefault;
    }

    await profile.save();
    await profile.populate('templates', 'templateName category');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Private
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    const idValidation = validateObjectId(id);
    if (!idValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: idValidation.message
      });
    }

    const profile = await Profile.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    await profile.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting profile'
    });
  }
};

// @desc    Add template to profile
// @route   POST /api/profiles/:id/templates/:templateId
// @access  Private
export const addTemplateToProfile = async (req, res) => {
  try {
    const { id, templateId } = req.params;

    // Validate ObjectIds
    const profileIdValidation = validateObjectId(id);
    if (!profileIdValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID'
      });
    }

    const templateIdValidation = validateObjectId(templateId);
    if (!templateIdValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID'
      });
    }

    const profile = await Profile.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Check if template exists and belongs to user
    const template = await Template.findOne({
      _id: templateId,
      userId: req.user._id
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await profile.addTemplate(templateId);
    await profile.populate('templates', 'templateName category');

    res.status(200).json({
      success: true,
      message: 'Template added to profile successfully',
      data: profile
    });
  } catch (error) {
    console.error('Add Template to Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove template from profile
// @route   DELETE /api/profiles/:id/templates/:templateId
// @access  Private
export const removeTemplateFromProfile = async (req, res) => {
  try {
    const { id, templateId } = req.params;

    const profile = await Profile.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    await profile.removeTemplate(templateId);
    await profile.populate('templates', 'templateName category');

    res.status(200).json({
      success: true,
      message: 'Template removed from profile successfully',
      data: profile
    });
  } catch (error) {
    console.error('Remove Template from Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};