import { call, put, takeLatest } from 'redux-saga/effects';
import { getProductRecords } from '../../services/productService';
import {
  fetchProductsFailure,
  fetchProductsRequest,
  fetchProductsSuccess,
} from '../reducers/productsSlice';
import type { Product } from '../../types/product';

type ProductResponse = {
  data: Product[];
  message: string;
  status: 'success' | 'error' | string;
};

function* fetchProductsSaga() {
  try {
    const { data, message, status }: ProductResponse = yield call(getProductRecords);

    if (status !== 'success') {
      throw new Error(message);
    }
    yield put(fetchProductsSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    yield put(fetchProductsFailure(message));
  }
}

function* watchFetchProducts() {
  yield takeLatest(fetchProductsRequest.type, fetchProductsSaga);
}

export default watchFetchProducts;
