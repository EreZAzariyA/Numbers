import { TokenResponse } from "@react-oauth/google";

export class EmailModel {
  email: string;
  isValidate?: boolean = false;
  isActive?: boolean = false;

  constructor(email: EmailModel) {
    this.email = email.email;
    this.isValidate = email.isValidate;
    this.isActive = email.isActive;
  }
};

export interface PastOrFutureDebits {
  debitMonth: string;
  monthlyNumberOfTransactions: number;
  monthlyNISDebitSum: number;
  monthlyUSDDebitSum: number;
  monthlyEURDebitSum: number;
};

export class UserBankModel {
  _id: string;
  bankName: string;
  credentials: string;
  details: {
    account: string,
    balance: number,
  };
  lastConnection: number;
  extraInfo?: any;
  pastOrFutureDebits?: PastOrFutureDebits[];
};

class UserModel {
  _id?: string;
  profile: {
    first_name: string;
    last_name: string;
    image_url?: string;
  };
  emails: EmailModel[];
  services: {
    password: string;
    google?: TokenResponse;
  };
  config?: {
    lang?: string,
    'theme-color'?: string
  };
  bank?: UserBankModel[];

  constructor(user: UserModel) {
    this._id = user._id;
    this.profile = user.profile;
    this.emails = user.emails;
    this.services = user.services;
    this.config = user.config;
    this.bank = user.bank;
  }
};

export default UserModel;