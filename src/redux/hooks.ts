import {
  TypedUseSelectorHook,
  useDispatch as useOriginDispatch,
  useSelector as useOriginSelector,
} from 'react-redux';

import type { RootState, AppDispatch } from './store';

export const useDispatch = () => useOriginDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useOriginSelector;
