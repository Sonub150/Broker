import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: null
};

const userSlice = createSlice({

    name:'user',
    initialState,
    reducers:{
        signInStart:(status)=>{
            status.loading = true;
        },
        signInSuccess:(status,action)=>{
            status.currentUser=action.payload;
            status.loading = false;
            status.error = null;
        },
        signInFailure:(status,action)=>{
            status.error = action.payload;
            status.loading = false;

        }
    }


});

export const {signInStart,signInSuccess,signInFailure} = userSlice.actions;
export default userSlice.reducer;