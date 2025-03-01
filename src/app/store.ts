import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../features/authentication/authenticationSlice"
import loaderReducer from "../features/loader/loaderSlice"
export const store=configureStore({
    reducer:{
        AuthenticationState:authenticationReducer,
        LoaderState:loaderReducer
    }
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch