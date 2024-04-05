import { Dayjs } from "dayjs";

class CategoryModel {
  _id: string;
  user_id: string;
  name: string;

  constructor(category: CategoryModel) {
    this._id = category._id;
    this.user_id = category.user_id;
    this.name = category.name;
  };
};

export default CategoryModel;