import axios from "axios";
import config from "../utils/config";
import CategoryModel from "../models/category-model";
import store from "../redux/store";
import { addNewCategoryAction, fetchCategoriesAction, removeCategoryAction, updateCategoryAction } from "../redux/slicers/categories";

class CategoriesServices {
  async fetchCategoriesByUserId(user_id: string): Promise<CategoryModel[]> {
    const response = await axios.get<CategoryModel[]>(config.urls.categories + `/${user_id}`);
    const userCategories = response.data;
    store.dispatch(fetchCategoriesAction(userCategories));
    return userCategories;
  };

  async addCategory(category: CategoryModel): Promise<CategoryModel> {
    const response = await axios.post<CategoryModel>(config.urls.categories, category);
    const addedCategory = response.data;
    store.dispatch(addNewCategoryAction(addedCategory));
    return addedCategory;
  };

  async updateCategory(category: CategoryModel): Promise<CategoryModel> {
    const response = await axios.put<CategoryModel>(config.urls.categories, category);
    const updatedCategory = response.data;
    store.dispatch(updateCategoryAction(updatedCategory));
    return updatedCategory;
  };

  async removeCategory(category_id: string): Promise<void> {
    await axios.delete<void>(config.urls.categories + `/${category_id}`);
    store.dispatch(removeCategoryAction(category_id));
  };
};

const categoriesServices = new CategoriesServices();
export default categoriesServices;