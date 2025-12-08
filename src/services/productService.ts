import { deleteAPI, getAPI, postAPI, putAPI } from '../utils/axios';
import { API_CONFIG } from './apiConfig';
import type { Product } from '../types/product';
import type { ImagePreview } from '../types/product';

type ApiSuccess<T> = {
  status: 'success';
  message: string;
  data: T;
};

type ApiError = {
  status: 'error';
  message: string;
};

export type ProductResponse = ApiSuccess<Product[]> | ApiError;

export const handleHealthCheck = async (): Promise<ApiSuccess<unknown> | ApiError> => {
  const response = await getAPI<ApiSuccess<unknown> | ApiError>('/api/health');
  return response;
};

const appendProductFields = (formData: FormData, productData: Partial<Product>) => {
  Object.entries(productData).forEach(([key, value]) => {
    if (key === 'images') return;
    if (value == null) return;
    formData.append(key, String(value));
  });
};

const appendImages = (formData: FormData, images: Product['images'] = []) => {
  images.forEach(file => {
    if (typeof file === 'string') {
      formData.append('images', file);
      return;
    }

    const candidate: File | null = file instanceof File ? file : (file?.file ?? null);
    if (candidate) {
      formData.append('images', candidate);
    }
  });
};

export const addProductRecords = async (
  productData: Product,
  successCallBack: () => void
): Promise<ApiSuccess<Product> | ApiError> => {
  const formData = new FormData();
  appendProductFields(formData, productData);
  appendImages(formData, productData.images);

  const response = await postAPI<ApiSuccess<Product> | ApiError>(
    `/api/tables/${API_CONFIG.tableName}/records?overwrite=true`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (response.status === 'success') {
    successCallBack();
  }

  return response;
};

export const getProductRecords = async (): Promise<ProductResponse> => {
  return getAPI<ProductResponse>(`/api/tables/${API_CONFIG.tableName}/records`);
};

export const deleteProductRecords = async (
  productId: string | number,
  successCallBack: () => void
): Promise<ApiSuccess<null> | ApiError> => {
  const response = await deleteAPI<ApiSuccess<null> | ApiError>(
    `/api/tables/${API_CONFIG.tableName}/records/${productId}`
  );

  if (response.status === 'success') {
    successCallBack();
  }

  return response;
};

export const editProductRecord = async (
  productId: string | number,
  productData: Product,
  toDelete: string[] = [],
  successCallBack: () => void
): Promise<ApiSuccess<Product> | ApiError> => {
  const formData = new FormData();
  const queryString = toDelete.length
    ? `?to_delete=${encodeURIComponent(JSON.stringify(toDelete))}`
    : '';

  appendProductFields(formData, productData);

  if (productData.images?.length) {
    appendImages(formData, productData.images);
  } else {
    formData.append('images', 'no_upload');
  }

  const response = await putAPI<ApiSuccess<Product> | ApiError>(
    `/api/tables/${API_CONFIG.tableName}/records/${productId}${queryString}`,
    formData,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (response.status === 'success') {
    successCallBack();
  }

  return response;
};
