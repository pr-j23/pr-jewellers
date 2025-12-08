import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setEditableProductDetails } from '../redux/reducers/editableProductDetailsSlice';
import { fetchProductsRequest } from '../redux/reducers/productsSlice';
import {
  addProductRecords,
  editProductRecord,
  handleHealthCheck as runHealthCheck,
} from '../services/productService';
import {
  getCategoryDropdownConfig,
  getSelectedCategoryValue,
  normalizeCategorySelection,
  normalizeNumeric,
} from '../utils';
import { ProductFormLabel, ProductFormMode, ProductValidationMode } from '../constants/product';
import { getProductValidationErrors } from '../utils/productValidation';

const INITIAL_PRODUCT = {
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

const useProductForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const editableProductDetails = useSelector(state => state.editableProduct.editableProductDetails);

  const [selectedApiType, setSelectedApiType] = useState(null);
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [notAvailable, setNotAvailable] = useState(null);
  const [touched, setTouched] = useState({});
  const [healthCheck, setHealthCheck] = useState({
    data: null,
    isLoading: false,
    error: null,
  });

  const selectedCategoryValue = getSelectedCategoryValue(product);

  const resetToInitial = useCallback(() => {
    setProduct(INITIAL_PRODUCT);
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
      setHealthCheck({ data: res, isLoading: false, error: res?.error });
    } catch (error) {
      console.error('Error during health check:', error);
      setHealthCheck({ data: null, isLoading: false, error: error.message });
    }
  }, []);

  const mapEditableDetailsToProduct = useCallback(() => {
    if (!editableProductDetails) return INITIAL_PRODUCT;

    return {
      product_id: editableProductDetails.product_id || '',
      name: editableProductDetails.name || '',
      description: editableProductDetails.description || '',
      images: editableProductDetails.images || [],
      weight: normalizeNumeric(editableProductDetails.weight),
      category: editableProductDetails.category || '',
      sub_category: editableProductDetails.sub_category || '',
      fixed_price: normalizeNumeric(editableProductDetails.fixed_price),
      metal_type: editableProductDetails.metal_type || '',
    };
  }, [editableProductDetails]);

  const handleApiTypeDropdownSelection = useCallback(
    sApiType => {
      const { value } = sApiType || {};
      setSelectedApiType(sApiType);
      setNotAvailable(
        value === ProductFormMode.ADD_CAROUSEL_IMAGE ||
          (value === ProductFormMode.EDIT && !editableProductDetails)
          ? true
          : null
      );

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
          setPreviewImages(editableProductDetails.images || []);
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

  const handleChange = useCallback((e, field) => {
    const { type, value } = e.target;
    let updatedValue = value;

    if (type === 'number') {
      if (value === '') {
        updatedValue = '';
      } else {
        const numericValue = Number(value);
        updatedValue = Number.isNaN(numericValue) ? '' : Math.max(0, numericValue);
      }
    }

    setProduct(prev => ({
      ...prev,
      [field]: updatedValue,
    }));
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleCategoryChange = useCallback(option => {
    setProduct(prev => ({
      ...prev,
      ...normalizeCategorySelection(option),
    }));
    setTouched(prev => ({ ...prev, category: true, sub_category: true }));
  }, []);

  const handleMetalTypeChange = useCallback(option => {
    setProduct(prev => ({
      ...prev,
      metal_type: option.value,
    }));
    setTouched(prev => ({ ...prev, metal_type: true }));
  }, []);

  const selectedApiTypeValue = selectedApiType?.value;
  const isAddMode = selectedApiTypeValue === ProductFormMode.ADD;
  const validationErrors = useMemo(
    () =>
      getProductValidationErrors(product, {
        mode: isAddMode ? ProductValidationMode.ADD : ProductValidationMode.EDIT,
      }),
    [product, isAddMode]
  );
  const isFormValid = useMemo(() => Object.keys(validationErrors).length === 0, [validationErrors]);

  const touchErrorFields = useCallback(errors => {
    if (!errors) return;
    const map = Object.keys(errors).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(prev => ({ ...prev, ...map }));
  }, []);

  const handleFieldBlur = useCallback(field => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const submitProduct = useCallback(
    async (submitFn, successMessage) => {
      setIsSubmitting(true);
      try {
        await submitFn();
        toast.success(successMessage);
        resetToInitial();
        successCallBack();
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
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
    return submitProduct(
      () => editProductRecord(editableProductDetails?.id, product, imagesToDelete, successCallBack),
      'Edited product successfully!'
    );
  }, [editableProductDetails?.id, imagesToDelete, product, submitProduct, successCallBack]);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      if (selectedApiTypeValue === ProductFormMode.ADD) {
        if (isFormValid) {
          handleAddProduct();
        } else {
          touchErrorFields(validationErrors);
          toast.error('Please fill in all required fields.');
        }
      } else if (selectedApiTypeValue === ProductFormMode.EDIT && editableProductDetails) {
        const editErrors = getProductValidationErrors(product, {
          mode: ProductValidationMode.EDIT,
        });
        if (Object.keys(editErrors).length) {
          touchErrorFields(editErrors);
          toast.error('Please fix the highlighted fields.');
          return;
        }
        handleEditProduct();
      }
    },
    [
      editableProductDetails,
      handleAddProduct,
      handleEditProduct,
      isFormValid,
      selectedApiType,
      touchErrorFields,
      validationErrors,
      selectedApiTypeValue,
      product,
    ]
  );

  const categoryDropdownConfig = useMemo(
    () =>
      getCategoryDropdownConfig(
        product,
        {
          showAllOption: false,
          blockParentSelectionWithChildren: true,
        }
      ),
    [product]
  );

  useEffect(() => {
    handleHealthClick();
  }, [handleHealthClick]);

  useEffect(() => {
    if (editableProductDetails) {
      setSelectedApiType({
        value: ProductFormMode.EDIT,
        label: ProductFormLabel[ProductFormMode.EDIT],
      });
      setProduct(mapEditableDetailsToProduct());
      setPreviewImages(editableProductDetails.images || []);
    }
  }, [editableProductDetails, mapEditableDetailsToProduct]);

  return {
    state: {
      product,
      previewImages,
      selectedApiType,
      selectedApiTypeValue,
      notAvailable,
      isSubmitting,
      imagesToDelete,
      healthCheck,
      categoryDropdownConfig,
    },
    actions: {
      setPreviewImages,
      setImagesToDelete,
      setSelectedApiType,
      setProduct,
    },
    handlers: {
      handleSubmit,
      handleChange,
      handleCategoryChange,
      handleMetalTypeChange,
      handleHealthClick,
      handleApiTypeDropdownSelection,
    },
    utils: {
      isFormValid,
      validationErrors,
      touched,
      handleFieldBlur,
      isAddMode,
    },
    editableProductDetails,
    user,
    navigate,
  };
};

export default useProductForm;
