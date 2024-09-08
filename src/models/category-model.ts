class CategoryModel {
  _id: string;
  name: string;
  spent: number;
  maximumSpentAllowed?: {
    active: boolean;
    maximumAmount: number;
  }

  constructor(category: CategoryModel) {
    this._id = category._id;
    this.name = category.name;
    this.spent = category.spent;
    this.maximumSpentAllowed = {
      active: category.maximumSpentAllowed.active,
      maximumAmount: category.maximumSpentAllowed.maximumAmount
    };
  };
};

export default CategoryModel;