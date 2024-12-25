import { all } from "redux-saga/effects";
import watchFetchProducts from "./productsSaga";
// import { watchAddItemToCart } from './sagas/cartSaga';

export function* rootSaga() {
  yield all([
    watchFetchProducts(),
    // watchAddItemToCart(),
  ]);
}
