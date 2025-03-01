import { createSlice } from "@reduxjs/toolkit"

interface ILoader{
    loading:boolean
}
const initialState:ILoader={
    loading:false
}

const loaderSlice=createSlice({
    initialState,
    name:"Loader Slice",
    reducers:{
        loadingOn:(state)=>{
            state.loading=true
        },
        loadingOff:(state)=>{
            state.loading=false
        }
    }
})

export const {loadingOff,loadingOn}=loaderSlice.actions

export default loaderSlice.reducer