/**
 * Cloudinary Configuration
 * 
 * This module configures Cloudinary for file uploads in the Synqit platform.
 * It handles image uploads for user profiles, company logos/banners, and project assets.
 * 
 * @module config/cloudinary
 * @requires cloudinary - Cloudinary SDK for image and video management
 * @requires multer - Middleware for handling multipart/form-data
 * @requires multer-storage-cloudinary - Multer storage engine for Cloudinary
 * 
 * Environment Variables Required:
 * - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 * - CLOUDINARY_API_KEY: Your Cloudinary API key
 * - CLOUDINARY_API_SECRET: Your Cloudinary API secret
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';

/**
 * Configure Cloudinary with environment variables
 * Throws error if required environment variables are missing
 */
const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary configuration. Please check your environment variables.');
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  return cloudinary;
};

// Initialize Cloudinary configuration
export const cloudinaryInstance = configureCloudinary();

/**
 * Allowed file types for uploads
 */
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

/**
 * Maximum file size (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Storage configuration for different upload types
 */
export const createCloudinaryStorage = (folder: string, transformations?: any[]) => {
  return new CloudinaryStorage({
    cloudinary: cloudinaryInstance,
    params: async (req, file) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname).substring(1);
      
      return {
        folder: `synqit/${folder}`, // Organize uploads in folders
        public_id: `${file.fieldname}-${uniqueSuffix}`,
        format: fileExtension,
        transformation: transformations || [],
        allowed_formats: ALLOWED_FORMATS,
        resource_type: 'auto',
      };
    },
  });
};

/**
 * Multer configurations for different upload types
 */

/**
 * Profile image upload configuration
 * - Max size: 5MB
 * - Allowed formats: jpg, jpeg, png, gif, webp
 * - Auto transformation: 500x500 square crop
 */
export const profileImageUpload = multer({
  storage: createCloudinaryStorage('profiles', [
    { width: 500, height: 500, crop: 'fill', gravity: 'face' },
    { quality: 'auto', fetch_format: 'auto' }
  ]),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).substring(1).toLowerCase();
    if (ALLOWED_FORMATS.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file format. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`));
    }
  },
});

/**
 * Company logo upload configuration
 * - Max size: 5MB
 * - Allowed formats: jpg, jpeg, png, svg, webp
 * - Auto transformation: 300x300 with padding
 */
export const companyLogoUpload = multer({
  storage: createCloudinaryStorage('companies/logos', [
    { width: 300, height: 300, crop: 'pad', background: 'transparent' },
    { quality: 'auto', fetch_format: 'auto' }
  ]),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).substring(1).toLowerCase();
    if (ALLOWED_FORMATS.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file format. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`));
    }
  },
});

/**
 * Company banner upload configuration
 * - Max size: 5MB
 * - Allowed formats: jpg, jpeg, png, webp
 * - Auto transformation: 1920x400 banner crop
 */
export const companyBannerUpload = multer({
  storage: createCloudinaryStorage('companies/banners', [
    { width: 1920, height: 400, crop: 'fill' },
    { quality: 'auto', fetch_format: 'auto' }
  ]),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).substring(1).toLowerCase();
    const bannerFormats = ['jpg', 'jpeg', 'png', 'webp'];
    if (bannerFormats.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file format. Allowed formats: ${bannerFormats.join(', ')}`));
    }
  },
});

/**
 * Project logo upload configuration
 * - Max size: 5MB
 * - Allowed formats: jpg, jpeg, png, svg, webp
 * - Auto transformation: 400x400 with padding
 */
export const projectLogoUpload = multer({
  storage: createCloudinaryStorage('projects/logos', [
    { width: 400, height: 400, crop: 'pad', background: 'transparent' },
    { quality: 'auto', fetch_format: 'auto' }
  ]),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).substring(1).toLowerCase();
    if (ALLOWED_FORMATS.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file format. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`));
    }
  },
});

/**
 * Project banner upload configuration
 * - Max size: 5MB
 * - Allowed formats: jpg, jpeg, png, webp
 * - Auto transformation: 1920x600 banner crop
 */
export const projectBannerUpload = multer({
  storage: createCloudinaryStorage('projects/banners', [
    { width: 1920, height: 600, crop: 'fill' },
    { quality: 'auto', fetch_format: 'auto' }
  ]),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).substring(1).toLowerCase();
    const bannerFormats = ['jpg', 'jpeg', 'png', 'webp'];
    if (bannerFormats.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file format. Allowed formats: ${bannerFormats.join(', ')}`));
    }
  },
});

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with deletion result
 */
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinaryInstance.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public ID or null if not found
 */
export const extractPublicId = (url: string): string | null => {
  if (!url) return null;
  
  try {
    // Match Cloudinary URL pattern and extract public ID
    const matches = url.match(/\/v\d+\/(.+)\./);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};