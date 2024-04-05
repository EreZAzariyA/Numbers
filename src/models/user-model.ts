import Role from "./role";

interface Email {
  email: string,
  isValid: boolean,
  isActive: boolean
};

export class EmailModel {
  email: string;
  isValid: boolean = false;
  isActive: boolean = false;

  constructor(email: string) {
    this.email = email;
  }
};

class UserModel {
  _id: string;
  profile: {
    first_name: string;
    last_name: string;
  };
  emails: Email[];
  services: {
    password: string
  };
  config?: {
    lang?: string,
    'theme-color'?: string
  }
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