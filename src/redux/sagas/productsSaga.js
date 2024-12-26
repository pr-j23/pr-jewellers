import { takeLatest, call, put } from "redux-saga/effects";
import { getProductRecords } from "../../services/productService";
import {
  fetchProductsFailure,
  fetchProductsRequest,
  fetchProductsSuccess,
} from "../reducers/productsSlice";

function* fetchProductsSaga() {
  try {
    const { data, message, status } = yield call(getProductRecords);

    if (status !== "success") {
      throw new Error(message);
    }
    yield put(fetchProductsSuccess(data));
  } catch (error) {
    yield put(fetchProductsFailure(error?.message));
  }
}

function* watchFetchProducts() {
  yield takeLatest(fetchProductsRequest.type, fetchProductsSaga);
}

export default watchFetchProducts;
