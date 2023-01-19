import {
  TypedUseSelectorHook,
  useDispatch as useOriginDispatch,
  useSelector as useOriginSelector,
} from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useDispatch = () => useOriginDispatch<AppDispatch>();
// export const useSelector: TypedUseSelectorHook<RootState> = useOriginSelector;
export const useDispatch = () => useOriginDispatch();
export const useSelector = useOriginSelector;
