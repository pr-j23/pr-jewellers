import { useCallback, useEffect, useMemo, useState } from 'react';
import type React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setEditableProductDetails } from '../redux/reducers/editableProductDetailsSlice';
import { fetchProductsRequest } from '../redux/reducers/productsSlice';
import {
  addProductRecords,
  editProductRecord,
  handleHealthCheck as runHealthCheck,
} from '../services/productService';
import { getCategoryDropdownConfig, normalizeCategorySelection, normalizeNumeric } from '../utils';
import { ProductFormLabel, ProductFormMode, ProductValidationMode, type ProductFormModeValue } from '../constants/product';
import { validateProduct } from '../utils/productValidation';
import type { DropdownOption, ImagePreview, Product } from '../types/product';
import type { CategoryDropdownConfig } from '../components/UpdateRecordsForm';
import type { AppDispatch, RootState } from '../redux/store';

export type HealthCheckResult = {
  status?: 'success' | 'error' | string;
  message?: string;
  error?: string | null;
};

export type HealthCheckState = {
  data: HealthCheckResult | null;
  isLoading: boolean;
  error: string | null;
};

export type UseProductFormReturn = {
  product: Product;
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
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Product
  ) => void;
  handleCategoryChange: (option: DropdownOption | null) => void;
  handleMetalTypeChange: (option: DropdownOption) => void;
  handleHealthClick: () => Promise<void>;
  handleApiTypeDropdownSelection: (option: DropdownOption | null) => void;
  isFormValid: boolean;
  validationErrors: Record<string, string>;
  touched: Record<string, boolean>;
  handleFieldBlur: (field: keyof Product) => void;
  isAddMode: boolean;
  editableProductDetails: Product | null;
  user: ReturnType<typeof useAuth>['user'];
  navigate: NavigateFunction;
};

const selectEditableProductDetails = (state: RootState) => state?.editableProduct?.editableProductDetails || null;

const INITIAL_PRODUCT: Product = {
  product_id: '',
  name: '',
  description: '',
  images: [],
  weight: 0,
  category: '',
  sub_category: '',
  fixed_price: 0,
  metal_type: '',
};

const createInitialProduct = (): Product => ({
  ...INITIAL_PRODUCT,
  images: [],
});

const isFile = (value: unknown): value is File => typeof File !== 'undefined' && value instanceof File;

const toPreviewImages = (images: Product['images'] = []): Array<string | ImagePreview> =>
  images.filter((image): image is string | ImagePreview => typeof image === 'string' || !isFile(image));

const useProductForm = (): UseProductFormReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const editableProductDetails = useSelector(selectEditableProductDetails);

  const [selectedApiType, setSelectedApiType] = useState<DropdownOption | null>(null);
  const [product, setProduct] = useState<Product>(() => createInitialProduct());
  const [previewImages, setPreviewImages] = useState<Array<string | ImagePreview>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [notAvailable, setNotAvailable] = useState<boolean | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [healthCheck, setHealthCheck] = useState<HealthCheckState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const resetToInitial = useCallback(() => {
    setProduct(createInitialProduct());
    setPreviewImages([]);
    setImagesToDelete([]);
    setTouched({});
  }, []);

  const successCallBack = useCallback(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const handleHealthClick = useCallback(async () => {
    setHealthCheck(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await runHealthCheck();
      setHealthCheck({
        data: res,
        isLoading: false,
        error: res?.status === 'error' ? res.message : null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error during health check:', error);
      setHealthCheck({ data: null, isLoading: false, error: message });
    }
  }, []);

  const mapEditableDetailsToProduct = useCallback((): Product => {
    if (!editableProductDetails) return INITIAL_PRODUCT;

    return {
      product_id: editableProductDetails.product_id || '',
      name: editableProductDetails.name || '',
      description: editableProductDetails.description || '',
      images: [...(editableProductDetails.images || [])],
      weight: normalizeNumeric(editableProductDetails.weight),
      category: editableProductDetails.category || '',
      sub_category: editableProductDetails.sub_category || '',
      fixed_price: normalizeNumeric(editableProductDetails.fixed_price),
      metal_type: editableProductDetails.metal_type || '',
    };
  }, [editableProductDetails]);

  const handleApiTypeDropdownSelection = useCallback(
    (option: DropdownOption | null) => {
      const value = option?.value as ProductFormModeValue | undefined;
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
          dispatch(setEditableProductDetails(null));
          break;
        case ProductFormMode.EDIT:
          setProduct(mapEditableDetailsToProduct());
          setPreviewImages(toPreviewImages(editableProductDetails.images || []));
          break;
        case ProductFormMode.ADD_CAROUSEL_IMAGE:
          dispatch(setEditableProductDetails(null));
          setPreviewImages([]);
          break;
        default:
          break;
      }
    },
    [dispatch, editableProductDetails, mapEditableDetailsToProduct, resetToInitial]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Product) => {
      const { type, value } = event.target;
      let updatedValue: string | number = value;

      if (type === 'number') {
        if (value === '') {
          updatedValue = '';
        } else {
          const numericValue = Number(value);
          updatedValue = Number.isNaN(numericValue) ? '' : Math.max(0, numericValue);
        }
      }

      setProduct(prev => ({ ...prev, [field]: updatedValue } as Product));
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

  const selectedApiTypeValue = (selectedApiType?.value as ProductFormModeValue | undefined) ?? null;
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

  const handleFieldBlur = useCallback((field: keyof Product) => {
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
        const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [resetToInitial, successCallBack]
  );

  const handleAddProduct = useCallback(() => {
    return submitProduct(() => addProductRecords(product, successCallBack), 'Product added successfully!');
  }, [product, submitProduct, successCallBack]);

  const handleEditProduct = useCallback(() => {
    const productId = editableProductDetails?.id;
    if (!productId) {
      toast.error('Unable to edit product without a valid identifier.');
      return Promise.resolve();
    }
    return submitProduct(
      () => editProductRecord(productId, product, imagesToDelete, successCallBack),
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
          return;
        }
        void handleEditProduct();
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
    void handleHealthClick();
  }, [handleHealthClick]);

  useEffect(() => {
    if (editableProductDetails) {
      setSelectedApiType({
        value: ProductFormMode.EDIT,
        label: ProductFormLabel[ProductFormMode.EDIT],
      });
      setProduct(mapEditableDetailsToProduct());
      setPreviewImages(toPreviewImages(editableProductDetails.images || []));
    }
  }, [editableProductDetails, mapEditableDetailsToProduct]);

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
    navigate,
  };
};

export default useProductForm;
