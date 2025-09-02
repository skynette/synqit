/**
 * Validation Utilities
 * 
 * This module provides validation helpers for common data types used in the application.
 * 
 * @module utils/validation
 */

/**
 * Validates if a string is a valid cuid
 * @param value - The string to validate
 * @returns boolean indicating if the value is a valid cuid
 */
export const isCuid = (value: string): boolean => {
  // cuid format: c + timestamp (8 chars) + counter (4 chars) + fingerprint (4 chars) + random (8 chars)
  // Total length: 25 characters, starts with 'c'
  const cuidRegex = /^c[a-z0-9]{24}$/;
  return cuidRegex.test(value);
};

/**
 * Express-validator custom validator for cuid
 * @param value - The value to validate
 * @returns boolean indicating if the value is a valid cuid
 * @throws Error if the value is not a valid cuid
 */
export const validateCuid = (value: string): boolean => {
  if (!isCuid(value)) {
    throw new Error('Must be a valid cuid');
  }
  return true;
};