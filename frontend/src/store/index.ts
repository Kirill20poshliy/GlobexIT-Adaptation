import { configureStore } from '@reduxjs/toolkit'
import subsReducer from './subSlice'
import collReducer from './collSlice'
import comandReducer from './comandSlice'
import { api } from './api'


export const store = configureStore({
    reducer: {
        subList: subsReducer,
        collList: collReducer,
        comandList: comandReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch