class CategoryModel {
  _id: string;
  name: string;

  constructor(category: CategoryModel) {
    this._id = category._id;
    this.name = category.name;
  };
};

export default CategoryModel;