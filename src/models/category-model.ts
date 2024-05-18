class CategoryModel {
  _id: string;
  user_id: string;
  name: string;
  expectedSpent: number

  constructor(category: CategoryModel) {
    this._id = category._id;
    this.user_id = category.user_id;
    this.name = category.name;
    this.expectedSpent = category.expectedSpent;
  };
};

export default CategoryModel;