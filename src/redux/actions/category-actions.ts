import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CategoryModel from "../../models/category-model";
import config from "../../utils/config";

export enum CategoriesActions {
  FETCH_CATEGORIES = "categories/fetchCategoriesAction",
  ADD_CATEGORY = "categories/addCategoryAction",
  UPDATE_CATEGORY = "categories/categories/updateCategoryAction",
  REMOVE_CATEGORY = "categories/removeCategoryAction",
};

export const fetchCategoriesAction = createAsyncThunk<CategoryModel[], string>(
  CategoriesActions.FETCH_CATEGORIES,
  async (user_id) => {
    const response = await axios.get<CategoryModel[]>(config.urls.categories + `/${user_id}`);
    const userCategories = response.data;
    return userCategories || [];
  }
);

export const addCategoryAction = createAsyncThunk<CategoryModel, {user_id: string, categoryName: string}>(
  CategoriesActions.ADD_CATEGORY,
  async ({ user_id, categoryName }, thunkApi) => {
    try {
      const response = await axios.post<CategoryModel>(config.urls.categories + `/${user_id}`, { categoryName });
      const addedCategory = response.data;
      return thunkApi.fulfillWithValue(addedCategory);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const updateCategoryAction = createAsyncThunk<CategoryModel, {user_id: string, category: CategoryModel}>(
  CategoriesActions.UPDATE_CATEGORY,
  async ({ user_id, category }, thunkApi) => {
    const response = await axios.put<CategoryModel>(config.urls.categories + `/${user_id}`, category);
    const updatedCategory = response.data;
    if (!!updatedCategory) {
      return updatedCategory;
    }
    return thunkApi.rejectWithValue('Some error while trying to update category');
  }
);

export const removeCategoryAction = createAsyncThunk<void, {category_id: string, user_id: string}>(
  CategoriesActions.REMOVE_CATEGORY,
  async ({ category_id, user_id }) => {
    await axios.delete<void>(config.urls.categories, { data: { category_id, user_id} });
  }
);