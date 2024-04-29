abstract class Config {
  public urls = {
    auth: {
      signUp: "",
      signIn: "",
      googleSignIn: ""
    },
    user: "",
    invoices: "",
    categories: "",
    bank: {
      fetchBankData: "",
      importTransactions: ""
    }
  };

  public constructor(baseUrl: string) {
    this.urls = {
      auth: {
        signUp: baseUrl + "auth/signup",
        signIn: baseUrl + "auth/signin",
        googleSignIn: baseUrl + "auth/google"
      },
      user: baseUrl + "user/",
      invoices: baseUrl + "invoices",
      categories: baseUrl + "categories",
      bank: {
        fetchBankData: baseUrl + "bank-account/fetch-bank-data",
        importTransactions: baseUrl + "bank-account/import-data",
      }
    }
  };
};

class DevelopmentConfig extends Config {
  public constructor() {
    // super("https://ea-numbers-server.vercel.app/api/");
    // super("https://ea-numbers-server-test.vercel.app/api/");
    // super("https://t2obu15q2h.execute-api.eu-central-1.amazonaws.com/");
    super("http://127.0.0.1:5001/api/");
  };
};

class ProductionConfig extends Config {
  public constructor() {
    super(process.env.REACT_APP_BASE_URL);
  };
};

const config = process.env.NODE_ENV !== "production" ? new DevelopmentConfig() : new ProductionConfig();
export default config;