import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthenticationState {
  isLoggedin: boolean;
  uid:string;
  email: string;
  name: string;
}

const initialState: IAuthenticationState = {
  isLoggedin: false,
  uid:"",
  email: "",
  name: "",
};

export const authenticationSlice = createSlice({
  initialState,
  name: "Authentication Slice",
  reducers: {
    loginSuccess: (state, action: PayloadAction<Omit<IAuthenticationState,"isLoggedin">>) => {
      return {
        isLoggedin: true,
        uid:action.payload.uid,
        email: action.payload.email,
        name: action.payload.name,
      };
    },
    logout:(state)=>{
        return initialState
    }
  },
});

export const {loginSuccess,logout}=authenticationSlice.actions
export default authenticationSlice.reducer