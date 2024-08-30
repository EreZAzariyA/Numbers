import { ActionReducerMapBuilder, createSlice, SerializedError } from '@reduxjs/toolkit'
import CategoryModel from '../../models/category-model';
import { addCategoryAction, fetchCategoriesAction, removeCategoryAction, updateCategoryAction } from '../actions/category-actions';

type InitialStateType = {
  categories: CategoryModel[];
  loading: boolean;
  error: SerializedError | null;
};

const initialState: InitialStateType = {
  categories: [],
  loading: false,
  error: null,
};

const extraReducers = (builder: ActionReducerMapBuilder<InitialStateType>) => {
  builder.addCase(fetchCategoriesAction.pending, (state) => ({
    ...state,
    loading: true
  }))
  .addCase(fetchCategoriesAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(fetchCategoriesAction.fulfilled, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    categories: action.payload
  }));

  builder.addCase(addCategoryAction.pending, (state) => ({
    ...state,
    loading: true
  }))
  .addCase(addCategoryAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(addCategoryAction.fulfilled, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    categories: [...state.categories, action.payload]
  }))

  builder.addCase(updateCategoryAction.pending, (state) => ({
    ...state,
    loading: true
  }))
  .addCase(updateCategoryAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(updateCategoryAction.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
    const index = state.categories.findIndex((c) => c._id === action.payload._id);
    state.categories[index] = action.payload;
  })

  builder.addCase(removeCategoryAction.pending, (state) => ({
    ...state,
    loading: true
  }))
  .addCase(removeCategoryAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(removeCategoryAction.fulfilled, (state, action) => {
    state.loading = false;
    const index = state.categories.findIndex((c) => c._id === action.meta.arg.category_id);
    state.categories.splice(index, 1);
  })
};

const categoriesSlicer = createSlice({
  name: 'categories',
  initialState,
  reducers: null,
  extraReducers
});

export default categoriesSlicer.reducer;