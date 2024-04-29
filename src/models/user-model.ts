import { TokenResponse } from "@react-oauth/google";
import Role from "./role";

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

class UserModel {
  _id: string;
  profile: {
    first_name: string;
    last_name: string;
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
  bank?: [{
    bankName: string
    credentials: string,
    details: object,
    lastConnection: number
  }];
  role: Role = Role.User;

  constructor(user: UserModel) {
    this._id = user._id;
    this.profile = {
      first_name: user.profile.first_name,
      last_name: user.profile.last_name
    };
    this.emails = user.emails;
    this.services = user.services;
    this.config = user.config;
    this.role = user.role;
  }
};

export default UserModel;