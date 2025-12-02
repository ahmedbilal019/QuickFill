import Template from '../models/Template.js';
import { validateTemplateName, validateTemplateFields, validateObjectId } from '../utils/validation.js';

// @desc    Get all templates for logged-in user
// @route   GET /api/templates
// @access  Private
export const getTemplates = async (req, res) => {
  try {
    const { category, isActive } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (category) {
      query.category = category;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const templates = await Template.find(query)
      .sort({ isDefault: -1, updatedAt: -1 });

    // Decrypt all templates
    const decryptedTemplates = templates.map(template => 
      template.getDecryptedTemplate()
    );

    res.status(200).json({
      success: true,
      count: templates.length,
      data: decryptedTemplates
    });
  } catch (error) {
    console.error('Get Templates Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching templates'
    });
  }
};

// @desc    Get single template by ID
// @route   GET /api/templates/:id
// @access  Private
export const getTemplateById = async (req, res) => {
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

    const template = await Template.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template.getDecryptedTemplate()
    });
  } catch (error) {
    console.error('Get Template Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching template'
    });
  }
};

// @desc    Create new template
// @route   POST /api/templates
// @access  Private
export const createTemplate = async (req, res) => {
  try {
    const { templateName, description, category, fields, encryptedFields } = req.body;

    // Validate template name
    const nameValidation = validateTemplateName(templateName);
    if (!nameValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: nameValidation.message
      });
    }

    // Validate fields
    const fieldsValidation = validateTemplateFields(fields);
    if (!fieldsValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: fieldsValidation.message
      });
    }

    // Check if template with same name exists
    const existingTemplate = await Template.findOne({
      userId: req.user._id,
      templateName: templateName.trim()
    });

    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Template with this name already exists'
      });
    }

    // Create template
    const template = await Template.create({
      userId: req.user._id,
      templateName: templateName.trim(),
      description: description || '',
      category: category || 'personal',
      fields,
      encryptedFields: encryptedFields || []
    });

    // Encrypt specified fields if any
    if (encryptedFields && encryptedFields.length > 0) {
      const fieldsMap = new Map(Object.entries(fields));
      
      encryptedFields.forEach(fieldName => {
        if (fieldsMap.has(fieldName)) {
          const encryptedValue = template.encryptField(fieldName, fieldsMap.get(fieldName));
          fieldsMap.set(fieldName, encryptedValue);
        }
      });

      template.fields = fieldsMap;
      await template.save();
    }

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template.getDecryptedTemplate()
    });
  } catch (error) {
    console.error('Create Template Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating template'
    });
  }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { templateName, description, category, fields, encryptedFields, isActive, isDefault } = req.body;

    // Validate ObjectId
    const idValidation = validateObjectId(id);
    if (!idValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: idValidation.message
      });
    }

    const template = await Template.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Validate template name if provided
    if (templateName) {
      const nameValidation = validateTemplateName(templateName);
      if (!nameValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: nameValidation.message
        });
      }

      // Check if another template with same name exists
      const existingTemplate = await Template.findOne({
        userId: req.user._id,
        templateName: templateName.trim(),
        _id: { $ne: id }
      });

      if (existingTemplate) {
        return res.status(400).json({
          success: false,
          message: 'Another template with this name already exists'
        });
      }

      template.templateName = templateName.trim();
    }

    if (description !== undefined) {
      template.description = description;
    }

    if (category) {
      template.category = category;
    }

    if (fields) {
      const fieldsValidation = validateTemplateFields(fields);
      if (!fieldsValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: fieldsValidation.message
        });
      }

      template.fields = new Map(Object.entries(fields));
      template.encryptedFields = encryptedFields || [];

      // Encrypt specified fields
      if (encryptedFields && encryptedFields.length > 0) {
        encryptedFields.forEach(fieldName => {
          if (template.fields.has(fieldName)) {
            const encryptedValue = template.encryptField(fieldName, template.fields.get(fieldName));
            template.fields.set(fieldName, encryptedValue);
          }
        });
      }
    }

    if (isActive !== undefined) {
      template.isActive = isActive;
    }

    if (isDefault !== undefined) {
      template.isDefault = isDefault;
      
      // If setting as default, unset other defaults
      if (isDefault) {
        await Template.updateMany(
          { userId: req.user._id, _id: { $ne: id } },
          { isDefault: false }
        );
      }
    }

    await template.save();

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: template.getDecryptedTemplate()
    });
  } catch (error) {
    console.error('Update Template Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating template'
    });
  }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
export const deleteTemplate = async (req, res) => {
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

    const template = await Template.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await template.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Delete Template Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting template'
    });
  }
};

// @desc    Increment template usage count
// @route   POST /api/templates/:id/use
// @access  Private
export const useTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await template.incrementUsage();

    res.status(200).json({
      success: true,
      message: 'Template usage recorded',
      data: {
        usageCount: template.usageCount,
        lastUsed: template.lastUsed
      }
    });
  } catch (error) {
    console.error('Use Template Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};