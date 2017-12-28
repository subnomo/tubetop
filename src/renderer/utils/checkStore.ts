import { conformsTo, isFunction, isObject } from 'lodash';
import * as invariant from 'invariant';

/**
 * Validate the shape of redux store
 */
export default function checkStore(store: any) {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    runSaga: isFunction,
    injectedReducers: isObject,
    injectedSagas: isObject,
  };

  invariant(
    conformsTo(store, shape),
    '(renderer/utils...) injectors: Expected a valid redux store',
  );
}
