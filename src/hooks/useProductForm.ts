import { useCallback, useEffect, useMemo, useState } from 'react';
import type React from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProducts } from '../redux/reducers/productsSlice';
import { addProductRecords, editProductRecord } from '../services/productService';
import { getCategoryDropdownConfig, normalizeCategorySelection, normalizeNumeric } from '../utils';
import {
  ProductFormLabel,
  ProductFormMode,
  ProductValidationMode,
  type ProductFormModeValue,
} from '../utils/productConstants';
import { validateProduct } from '../utils/productValidation';
import { useProductFormImages, toPreviewImages } from './useProductFormImages';
import {
  useProductHealthCheck,
  type HealthCheckResult,
  type HealthCheckState,
} from './useProductHealthCheck';
import type { DropdownOption, ImagePreview, Product } from '../types/product';
import type { CategoryDropdownConfig } from '../components/UpdateRecordsForm';
import type { AppDispatch } from '../redux/store';

export type { HealthCheckResult, HealthCheckState };

// Form state uses strings for number fields to handle cleared inputs properly
export type ProductFormValues = Omit<Product, 'weight' | 'fixed_price' | 'making_charges'> & {
  weight: string;
  fixed_price: string;
  making_charges: string;
};

export type UseProductFormReturn = {
  product: ProductFormValues;
  previewImages: Array<string | ImagePreview>;
  selectedApiType: DropdownOption | null;
  selectedApiTypeValue: ProductFormModeValue | null;
  notAvailable: boolean | null;
  isSubmitting: boolean;
  imagesToDelete: string[];
  healthCheck: HealthCheckState;
  categoryDropdownConfig: CategoryDropdownConfig | null;
  setPreviewImages: React.Dispatch<React.SetStateAction<Array<string | ImagePreview>>>;
  setImagesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedApiType: React.Dispatch<React.SetStateAction<DropdownOption | null>>;
  setProduct: React.Dispatch<React.SetStateAction<ProductFormValues>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ProductFormValues
  ) => void;
  handleCategoryChange: (option: DropdownOption | null) => void;
  handleMetalTypeChange: (option: DropdownOption) => void;
  handleHealthClick: () => Promise<void>;
  handleApiTypeDropdownSelection: (option: DropdownOption | null) => void;
  isFormValid: boolean;
  validationErrors: Record<string, string>;
  touched: Record<string, boolean>;
  handleFieldBlur: (field: keyof ProductFormValues) => void;
  isAddMode: boolean;
  editableProductDetails: Product | null;
  user: ReturnType<typeof useAuth>['user'];
};

const INITIAL_PRODUCT: ProductFormValues = {
  product_id: '',
  name: '',
  description: '',
  images: [],
  weight: '',
  category: '',
  sub_category: '',
  fixed_price: '',
  metal_type: '',
  making_charges: '',
};

const createInitialProduct = (): ProductFormValues => ({
  ...INITIAL_PRODUCT,
  images: [],
});

// Convert form values to Product for API submission
export const formValuesToProduct = (formValues: ProductFormValues): Product => ({
  ...formValues,
  weight: formValues.weight === '' ? 0 : Number(formValues.weight),
  fixed_price: formValues.fixed_price === '' ? 0 : Number(formValues.fixed_price),
  making_charges: formValues.making_charges === '' ? 0 : Number(formValues.making_charges),
});

const useProductForm = (): UseProductFormReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const location = useLocation();

  const initialProductFromNav = (location?.state as { product?: Product } | null)?.product ?? null;
  const [editableProductDetails, setEditableProductDetails] = useState<Product | null>(
    initialProductFromNav
  );

  const { healthCheck, handleHealthClick } = useProductHealthCheck();
  const { previewImages, setPreviewImages, imagesToDelete, setImagesToDelete, resetImages } =
    useProductFormImages();

  const [selectedApiType, setSelectedApiType] = useState<DropdownOption | null>(null);
  const [product, setProduct] = useState<ProductFormValues>(() => createInitialProduct());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notAvailable, setNotAvailable] = useState<boolean | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const resetToInitial = useCallback(() => {
    setProduct(createInitialProduct());
    resetImages();
    setTouched({});
  }, [resetImages]);

  const successCallBack = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const mapEditableDetailsToProduct = useCallback((): ProductFormValues => {
    if (!editableProductDetails) return INITIAL_PRODUCT;

    return {
      product_id: editableProductDetails.product_id || '',
      name: editableProductDetails.name || '',
      description: editableProductDetails.description || '',
      images: [],
      weight: String(normalizeNumeric(editableProductDetails.weight ?? null) ?? ''),
      category: editableProductDetails.category || '',
      sub_category: editableProductDetails.sub_category || '',
      fixed_price: String(normalizeNumeric(editableProductDetails.fixed_price ?? null) ?? ''),
      metal_type: editableProductDetails.metal_type || '',
      making_charges: String(normalizeNumeric(editableProductDetails.making_charges ?? null) ?? ''),
    };
  }, [editableProductDetails]);

  const handleApiTypeDropdownSelection = useCallback(
    (option: DropdownOption | null) => {
      const value = (option?.value as ProductFormModeValue | null) ?? null;
      setSelectedApiType(option);
      setNotAvailable(
        value === ProductFormMode.ADD_CAROUSEL_IMAGE ||
          (value === ProductFormMode.EDIT && !editableProductDetails)
          ? true
          : null
      );

      if (!value) return;

      if (!editableProductDetails) {
        if (value === ProductFormMode.ADD) {
          resetToInitial();
        }
        return;
      }

      switch (value) {
        case ProductFormMode.ADD:
          resetToInitial();
          setEditableProductDetails(null);
          break;
        case ProductFormMode.EDIT:
          setProduct(mapEditableDetailsToProduct());
          setPreviewImages(toPreviewImages(editableProductDetails.images || []));
          break;
        case ProductFormMode.ADD_CAROUSEL_IMAGE:
          setEditableProductDetails(null);
          setPreviewImages([]);
          break;
        default:
          break;
      }
    },
    [editableProductDetails, mapEditableDetailsToProduct, resetToInitial, setPreviewImages]
  );

  const handleChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: keyof ProductFormValues
    ) => {
      const { type, value } = event.target;
      let updatedValue: string = value;

      if (type === 'number') {
        if (value === '') {
          updatedValue = '';
        } else {
          const numericValue = Number(value);
          updatedValue = Number.isNaN(numericValue) ? '' : String(Math.max(0, numericValue));
        }
      }

      setProduct(prev => ({ ...prev, [field]: updatedValue }));
      setTouched(prev => ({ ...prev, [field]: true }));
    },
    []
  );

  const handleCategoryChange = useCallback((option: DropdownOption | null) => {
    setProduct(prev => ({
      ...prev,
      ...normalizeCategorySelection(option),
    }));
    setTouched(prev => ({ ...prev, category: true, sub_category: true }));
  }, []);

  const handleMetalTypeChange = useCallback((option: DropdownOption) => {
    setProduct(prev => ({
      ...prev,
      metal_type: option.value,
    }));
    setTouched(prev => ({ ...prev, metal_type: true }));
  }, []);

  const selectedApiTypeValue = (selectedApiType?.value as ProductFormModeValue | null) ?? null;
  const isAddMode = selectedApiTypeValue === ProductFormMode.ADD;
  const { errors: validationErrors, isValid: isFormValid } = useMemo(
    () =>
      validateProduct(product, {
        mode: isAddMode ? ProductValidationMode.ADD : ProductValidationMode.EDIT,
      }),
    [product, isAddMode]
  );

  const touchErrorFields = useCallback((errors?: Record<string, string> | null) => {
    if (!errors) return;
    const map = Object.keys(errors).reduce<Record<string, boolean>>((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(prev => ({ ...prev, ...map }));
  }, []);

  const handleFieldBlur = useCallback((field: keyof ProductFormValues) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const submitProduct = useCallback(
    async (submitFn: () => Promise<unknown>, successMessage: string) => {
      setIsSubmitting(true);
      try {
        await submitFn();
        toast.success(successMessage);
        resetToInitial();
        successCallBack();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [resetToInitial, successCallBack]
  );

  const handleAddProduct = useCallback(() => {
    const productForSubmit = formValuesToProduct(product);
    return submitProduct(
      () => addProductRecords(productForSubmit, successCallBack),
      'Product added successfully!'
    );
  }, [product, submitProduct, successCallBack]);

  const handleEditProduct = useCallback(() => {
    const productId = editableProductDetails?.id;
    if (!productId) {
      toast.error('Unable to edit product without a valid identifier.');
      return Promise.resolve();
    }
    const productForSubmit = formValuesToProduct(product);
    return submitProduct(
      () => editProductRecord(productId, productForSubmit, imagesToDelete, successCallBack),
      'Edited product successfully!'
    );
  }, [editableProductDetails?.id, imagesToDelete, product, submitProduct, successCallBack]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (selectedApiTypeValue === ProductFormMode.ADD) {
        if (isFormValid) {
          void handleAddProduct();
        } else {
          touchErrorFields(validationErrors);
          toast.error('Please fill in all required fields.');
        }
        return;
      }

      if (selectedApiTypeValue === ProductFormMode.EDIT && editableProductDetails) {
        const editValidation = validateProduct(product, {
          mode: ProductValidationMode.EDIT,
        });
        if (!editValidation.isValid) {
          touchErrorFields(editValidation.errors);
          toast.error('Please fix the highlighted fields.');
        } else {
          void handleEditProduct();
        }
      }
    },
    [
      editableProductDetails,
      handleAddProduct,
      handleEditProduct,
      isFormValid,
      touchErrorFields,
      validationErrors,
      selectedApiTypeValue,
      product,
    ]
  );

  const categoryDropdownConfig = useMemo<CategoryDropdownConfig | null>(
    () =>
      getCategoryDropdownConfig(product, {
        showAllOption: false,
        blockParentSelectionWithChildren: true,
      }) as CategoryDropdownConfig,
    [product]
  );

  useEffect(() => {
    if (editableProductDetails) {
      setSelectedApiType({
        value: ProductFormMode.EDIT,
        label: ProductFormLabel[ProductFormMode.EDIT],
      });
      setProduct(mapEditableDetailsToProduct());
      setPreviewImages(toPreviewImages(editableProductDetails.images || []));
    }
  }, [editableProductDetails, mapEditableDetailsToProduct, setPreviewImages]);

  return {
    product,
    previewImages,
    selectedApiType,
    selectedApiTypeValue,
    notAvailable,
    isSubmitting,
    imagesToDelete,
    healthCheck,
    categoryDropdownConfig,
    setPreviewImages,
    setImagesToDelete,
    setSelectedApiType,
    setProduct,
    handleSubmit,
    handleChange,
    handleCategoryChange,
    handleMetalTypeChange,
    handleHealthClick,
    handleApiTypeDropdownSelection,
    isFormValid,
    validationErrors,
    touched,
    handleFieldBlur,
    isAddMode,
    editableProductDetails,
    user,
  };
};

export default useProductForm;
