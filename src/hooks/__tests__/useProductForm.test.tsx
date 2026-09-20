import { act, renderHook } from '@testing-library/react';
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useProductForm from '../useProductForm';
import { ProductFormMode } from '../../utils/productConstants';

const {
  dispatchMock,
  navigateMock,
  locationMock,
  toastSuccessMock,
  toastErrorMock,
  addProductRecordsMock,
  editProductRecordMock,
  getAPIMock,
} = vi.hoisted(() => {
  return {
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
    locationMock: { state: null },
    toastSuccessMock: vi.fn(),
    toastErrorMock: vi.fn(),
    addProductRecordsMock: vi.fn(),
    editProductRecordMock: vi.fn(),
    getAPIMock: vi.fn(),
  };
});

vi.mock('react-redux', () => ({
  useDispatch: () => dispatchMock,
  useSelector: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { role: 'admin' } }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
  useLocation: () => locationMock,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock('../../services/productService', () => ({
  addProductRecords: (...args: unknown[]) => addProductRecordsMock(...args),
  editProductRecord: (...args: unknown[]) => editProductRecordMock(...args),
}));

vi.mock('../../utils/axios', () => ({
  getAPI: (...args: unknown[]) => getAPIMock(...args),
}));

vi.mock('../../redux/reducers/productsSlice', () => ({
  fetchProducts: () => ({ type: 'products/fetch' }),
  fetchProductsRequest: () => ({ type: 'products/fetch' }),
}));

describe('useProductForm', () => {
  beforeEach(() => {
    dispatchMock.mockReset();
    navigateMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    addProductRecordsMock.mockReset();
    editProductRecordMock.mockReset();
    getAPIMock.mockReset();
    addProductRecordsMock.mockResolvedValue(null);
    editProductRecordMock.mockResolvedValue(null);
    getAPIMock.mockResolvedValue({ status: 'ok' });
  });

  it('prevents submit when add form is invalid', async () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.handleApiTypeDropdownSelection({ value: ProductFormMode.ADD, label: 'Add' });
    });

    const event = { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(addProductRecordsMock).not.toHaveBeenCalled();
    expect(toastErrorMock).toHaveBeenCalledWith('Please fill in all required fields.');
  });

  it('submits add form when valid', async () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.handleApiTypeDropdownSelection({ value: ProductFormMode.ADD, label: 'Add' });
    });

    act(() => {
      result.current.setProduct(prev => ({
        ...prev,
        product_id: 'SKU-9',
        name: 'Test Product',
        description: 'Description',
        weight: '10',
        category: 'custom',
        sub_category: '',
        fixed_price: '500',
        making_charges: '50',
        metal_type: 'gold',
        images: ['preview'],
      }));
    });

    const event = { preventDefault: () => {} } as unknown as FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(addProductRecordsMock).toHaveBeenCalled();
    expect(toastSuccessMock).toHaveBeenCalledWith('Product added successfully!');
  });
});
