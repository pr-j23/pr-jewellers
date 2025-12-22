import { z } from 'zod';
import { ProductField, ProductValidationMode } from './productConstants';
import { requiresSubCategory } from './categoryHelpers';
import type { ProductFieldValue, ProductValidationModeValue } from './productConstants';
import type { Product } from '../types/product';
import type { ZodError } from 'zod';

const REQUIRED_MESSAGES: Record<ProductFieldValue, string> = {
  [ProductField.PRODUCT_ID]: 'Product ID is required',
  [ProductField.NAME]: 'Product name is required',
  [ProductField.DESCRIPTION]: 'Description is required',
  [ProductField.WEIGHT]: 'Weight must be greater than 0',
  [ProductField.FIXED_PRICE]: 'Fixed price must be zero or greater',
  [ProductField.MAKING_CHARGES]: 'Making charges must be zero or greater',
  [ProductField.CATEGORY]: 'Select a category',
  [ProductField.SUB_CATEGORY]: 'Select a subcategory',
  [ProductField.METAL_TYPE]: 'Select a metal type',
  [ProductField.IMAGES]: 'Upload at least one image',
};

const nonEmptyStringField = (field: ProductFieldValue) =>
  z.string().trim().min(1, { message: REQUIRED_MESSAGES[field] });

const positiveNumberField = (field: ProductFieldValue) =>
  z.union([z.number(), z.string()]).refine(value => {
    if (value === '' || value === null) {
      return false;
    }
    const numericValue = typeof value === 'number' ? value : Number(String(value));
    return Number.isFinite(numericValue) && numericValue > 0;
  }, REQUIRED_MESSAGES[field]);

const nonNegativeNumberField = (field: ProductFieldValue) =>
  z.union([z.number(), z.string()]).refine(value => {
    if (value === '' || value === null) {
      return false;
    }
    const numericValue = typeof value === 'number' ? value : Number(String(value));
    return Number.isFinite(numericValue) && numericValue >= 0;
  }, REQUIRED_MESSAGES[field]);

const nonNegativeOptionalNumberField = (field: ProductFieldValue) =>
  z
    .union([z.number(), z.string()])
    .optional()
    .refine(value => {
      if (value === '' || value === null || typeof value === 'undefined') {
        return true;
      }
      const numericValue = typeof value === 'number' ? value : Number(String(value));
      return Number.isFinite(numericValue) && numericValue >= 0;
    }, REQUIRED_MESSAGES[field]);

const categorySchema = z
  .object({
    [ProductField.CATEGORY]: nonEmptyStringField(ProductField.CATEGORY),
    [ProductField.SUB_CATEGORY]: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (requiresSubCategory(data[ProductField.CATEGORY]) && !data[ProductField.SUB_CATEGORY]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: REQUIRED_MESSAGES[ProductField.SUB_CATEGORY],
        path: [ProductField.SUB_CATEGORY],
      });
    }
  });

const addOnlySchema = z.object({
  [ProductField.PRODUCT_ID]: nonEmptyStringField(ProductField.PRODUCT_ID),
  [ProductField.NAME]: nonEmptyStringField(ProductField.NAME),
  [ProductField.DESCRIPTION]: nonEmptyStringField(ProductField.DESCRIPTION),
  [ProductField.WEIGHT]: positiveNumberField(ProductField.WEIGHT),
  [ProductField.FIXED_PRICE]: nonNegativeNumberField(ProductField.FIXED_PRICE),
  [ProductField.MAKING_CHARGES]: nonNegativeOptionalNumberField(ProductField.MAKING_CHARGES),
  [ProductField.METAL_TYPE]: nonEmptyStringField(ProductField.METAL_TYPE),
  [ProductField.IMAGES]: z
    .array(z.unknown())
    .min(1, { message: REQUIRED_MESSAGES[ProductField.IMAGES] }),
});

const editSchema = categorySchema;
const addSchema = categorySchema.merge(addOnlySchema);

export const productSchemasByMode: Record<
  ProductValidationModeValue,
  typeof addSchema | typeof editSchema
> = Object.freeze({
  [ProductValidationMode.ADD]: addSchema,
  [ProductValidationMode.EDIT]: editSchema,
});

const formatErrors = (zodError?: ZodError): Record<string, string> => {
  if (!zodError) return {};
  return zodError.issues.reduce<Record<string, string>>((acc, issue) => {
    const field = issue.path?.[0];
    if (typeof field === 'string' && !acc[field]) {
      acc[field] = issue.message;
    }
    return acc;
  }, {});
};

type ValidationOptions = {
  mode?: ProductValidationModeValue;
};

type ValidationResult = {
  data: Partial<Product> | null;
  errors: Record<string, string>;
  isValid: boolean;
};

export const validateProduct = (
  product: Partial<Product> = {},
  { mode = ProductValidationMode.ADD }: ValidationOptions = {}
): ValidationResult => {
  const schema = productSchemasByMode[mode] || addSchema;
  const result = schema.safeParse(product);
  if (result.success) {
    return { data: result.data as Partial<Product>, errors: {}, isValid: true };
  }
  return { data: null, errors: formatErrors(result.error), isValid: false };
};

export const getProductValidationErrors = (
  product: Partial<Product> = {},
  options: ValidationOptions = {}
): Record<string, string> => validateProduct(product, options).errors;
