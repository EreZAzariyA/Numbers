class CategoryModel {
  _id: string;
  name: string;
  spent: number;
  transactions?: number;
  maximumSpentAllowed?: {
    active: boolean;
    maximumAmount: number;
  }
};

export default CategoryModel;