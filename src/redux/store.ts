import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import {
  userInfoSlice,
  unitsSlice,
  managersSlice,
  applyAuditSlice,
} from './reducers';

const rootReducer = combineReducers({
  userInfo: userInfoSlice.reducer,
  units: unitsSlice.reducer,
  managers: managersSlice.reducer,
  applyAudit: applyAuditSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
