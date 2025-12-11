import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // ✅ correct storage import
import authReducer from "./reducer/authReducer";
import  cartReducer  from "./reducer/cartReducer";

const rootReducer = combineReducers({
  authStore: authReducer,
  cartStore: cartReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // ✅ correct variable
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ fixed typo
    }),
});

export const persistor = persistStore(store);
