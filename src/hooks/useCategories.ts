import { useQuery } from "@tanstack/react-query";
import CategoryModel from "../models/category-model";
import { useAppSelector } from "../redux/store";
import categoriesServices from "../services/categories";

export const CATEGORIES_QUERY_KEY = "categories";

export const useCategories = () => {
  const user = useAppSelector((state) => state.auth.user);

  return useQuery<CategoryModel[]>({
    queryKey: [CATEGORIES_QUERY_KEY, user?._id],
    queryFn: () => categoriesServices.fetchCategories(user._id),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });
};
