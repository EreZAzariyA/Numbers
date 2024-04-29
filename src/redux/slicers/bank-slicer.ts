import { ActionReducerMapBuilder, PayloadAction, ReducerType } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { AuthState } from "./auth-slicer";


const extraReducer = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder.addCase('import-transactions', (state, action) => {
    
  })
};

export default extraReducer;