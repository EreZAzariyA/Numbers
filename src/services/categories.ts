import axios from "axios";
import CategoryModel from "../models/category-model";
import config from "../utils/config";

class CategoriesServices {
  fetchCategories = async (user_id: string): Promise<CategoryModel[]> => {
    const response = await axios.get<CategoryModel[]>(config.urls.categories + `/${user_id}`);
    const userCategories = response.data;
    return userCategories;
  };

  addCategory = async (user_id: string, categoryName: string): Promise<CategoryModel> => {
    const response = await axios.post<CategoryModel>(config.urls.categories + `/${user_id}`, { categoryName });
    const addedCategory = response.data;
    return addedCategory;
  };

  updateCategory = async (user_id: string, category: Partial<CategoryModel>): Promise<CategoryModel> => {
    const response = await axios.put<CategoryModel>(config.urls.categories + `/${user_id}`, category);
    const updatedCategory = response.data;
    return updatedCategory;
  };

  removeCategory = async (user_id: string, category_id: string): Promise<void> => {
    await axios.delete<void>(config.urls.categories, { data: { category_id, user_id} });
  };
}

const categoriesServices = new CategoriesServices();
export default categoriesServices;