import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import CategoryModel from '../../models/category-model';

const initialState: CategoryModel[] = [];

const categoriesSlicer = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesAction(state, action: PayloadAction<CategoryModel[]>) {
      state = action.payload;
      return state;
    },
    addNewCategoryAction(state, action: PayloadAction<CategoryModel>) {
      state.push(action.payload);
      return state;
    },
    updateCategoryAction(state, action: PayloadAction<CategoryModel>) {
      const categoryIndex = state.findIndex((c) => c._id === action.payload._id);
      const newState = state
      newState[categoryIndex] = action.payload;
      return newState;
    },
    removeCategoryAction(state, action: PayloadAction<string>) {
      const newState = state.filter((category) => category._id !== action.payload);
      return newState;
    },
    categoriesOnLogoutAction() {
      return initialState;
    }
  }
});

export const { fetchCategoriesAction, addNewCategoryAction, updateCategoryAction, removeCategoryAction, categoriesOnLogoutAction } = categoriesSlicer.actions;
export default categoriesSlicer.reducer