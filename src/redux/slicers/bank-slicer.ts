import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AuthState } from "./auth-slicer";


const extraReducer = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder.addCase('import-transactions', (state, action) => {
    
  })
};

export default extraReducer;