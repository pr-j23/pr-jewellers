import { all } from 'redux-saga/effects';
import watchFetchProducts from './productsSaga';

export function* rootSaga() {
  yield all([watchFetchProducts()]);
}
