abstract class Config {
  public urls = {
    auth: {
      signUp: "",
      signIn: ""
    },
    user: "",
    invoices: "",
    categories: "",
  };

  public constructor(baseUrl: string) {
    this.urls = {
      auth: {
        signUp: baseUrl + "auth/signup",
        signIn: baseUrl + "auth/signin"
      },
      user: baseUrl + "user/",
      invoices: baseUrl + "invoices",
      categories: baseUrl + "categories",
    }
  };
};

class DevelopmentConfig extends Config {
  public constructor() {
    super("https://t2obu15q2h.execute-api.eu-central-1.amazonaws.com/");
    // super("http://127.0.0.1:5001/api/");
  };
};

class ProductionConfig extends Config {
  public constructor() {
    super(process.env.REACT_APP_BASE_URL);
  };
};

const config = process.env.NODE_ENV === "development" ? new DevelopmentConfig() : new ProductionConfig();
export default config;