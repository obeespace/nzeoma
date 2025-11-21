// Product Schema for MongoDB
export const ProductSchema = {
  // Required fields
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200
  },
  price: {
    type: 'string',
    required: true,
    pattern: /^₦[\d,]+$/
  },
  image: {
    type: 'string',
    required: true
  },
  alt: {
    type: 'string',
    required: true
  },
  
  // Optional fields with defaults
  category: {
    type: 'string',
    required: false,
    enum: ['Fex Solar', 'KTJ', 'De Cecon', 'EcoBoost', 'Street Lights', 'Industrial', 'Smart Lights'],
    default: 'General'
  },
  wattage: {
    type: 'number',
    required: false,
    min: 1,
    max: 5000
  },
  description: {
    type: 'string',
    required: false,
    maxLength: 1000
  },
  features: {
    type: 'array',
    required: false,
    items: {
      type: 'string',
      maxLength: 100
    },
    maxItems: 10
  },
  inStock: {
    type: 'boolean',
    required: false,
    default: true
  },
  rating: {
    type: 'number',
    required: false,
    min: 0,
    max: 5,
    default: 4.5
  },
  reviews: {
    type: 'number',
    required: false,
    min: 0,
    default: 0
  },
  
  // System fields
  createdAt: {
    type: 'date',
    required: false,
    default: () => new Date()
  },
  updatedAt: {
    type: 'date',
    required: false,
    default: () => new Date()
  }
};

// Validation function
export function validateProduct(product, isUpdate = false) {
  const errors = [];
  
  // Check required fields (skip for updates if not provided)
  if (!isUpdate || product.hasOwnProperty('name')) {
    if (!product.name || typeof product.name !== 'string' || product.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    } else if (product.name.length > 200) {
      errors.push('Name must be less than 200 characters');
    }
  }
  
  if (!isUpdate || product.hasOwnProperty('price')) {
    if (!product.price || typeof product.price !== 'string') {
      errors.push('Price is required and must be a string');
    } else if (!product.price.match(/^₦[\d,]+$/)) {
      errors.push('Price must be in format "₦X,XXX" with naira symbol');
    }
  }
  
  if (!isUpdate || product.hasOwnProperty('image')) {
    if (!product.image || typeof product.image !== 'string' || product.image.trim().length === 0) {
      errors.push('Image URL is required');
    }
  }
  
  if (!isUpdate || product.hasOwnProperty('alt')) {
    if (!product.alt || typeof product.alt !== 'string' || product.alt.trim().length === 0) {
      errors.push('Alt text is required for accessibility');
    }
  }
  
  // Validate optional fields if provided
  if (product.category && !ProductSchema.category.enum.includes(product.category)) {
    errors.push(`Category must be one of: ${ProductSchema.category.enum.join(', ')}`);
  }
  
  if (product.wattage !== undefined) {
    if (typeof product.wattage !== 'number' || product.wattage < 1 || product.wattage > 5000) {
      errors.push('Wattage must be a number between 1 and 5000');
    }
  }
  
  if (product.description && (typeof product.description !== 'string' || product.description.length > 1000)) {
    errors.push('Description must be a string with maximum 1000 characters');
  }
  
  if (product.features) {
    if (!Array.isArray(product.features)) {
      errors.push('Features must be an array');
    } else if (product.features.length > 10) {
      errors.push('Maximum 10 features allowed');
    } else if (product.features.some(f => typeof f !== 'string' || f.length > 100)) {
      errors.push('Each feature must be a string with maximum 100 characters');
    }
  }
  
  if (product.inStock !== undefined && typeof product.inStock !== 'boolean') {
    errors.push('inStock must be a boolean');
  }
  
  if (product.rating !== undefined) {
    if (typeof product.rating !== 'number' || product.rating < 0 || product.rating > 5) {
      errors.push('Rating must be a number between 0 and 5');
    }
  }
  
  if (product.reviews !== undefined) {
    if (typeof product.reviews !== 'number' || product.reviews < 0) {
      errors.push('Reviews count must be a non-negative number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Sanitize product data
export function sanitizeProduct(product, isUpdate = false) {
  const sanitized = {};
  
  // Copy and sanitize known fields
  if (product.name !== undefined) sanitized.name = String(product.name).trim();
  if (product.price !== undefined) sanitized.price = String(product.price).trim();
  if (product.image !== undefined) sanitized.image = String(product.image).trim();
  if (product.alt !== undefined) sanitized.alt = String(product.alt).trim();
  if (product.category !== undefined) sanitized.category = String(product.category).trim();
  if (product.wattage !== undefined) sanitized.wattage = Number(product.wattage);
  if (product.description !== undefined) sanitized.description = String(product.description).trim();
  if (product.features !== undefined && Array.isArray(product.features)) {
    sanitized.features = product.features.map(f => String(f).trim()).filter(f => f.length > 0);
  }
  if (product.inStock !== undefined) sanitized.inStock = Boolean(product.inStock);
  if (product.rating !== undefined) sanitized.rating = Number(product.rating);
  if (product.reviews !== undefined) sanitized.reviews = Number(product.reviews);
  
  // Add/update system fields
  if (!isUpdate) {
    sanitized.createdAt = new Date();
  }
  sanitized.updatedAt = new Date();
  
  return sanitized;
}