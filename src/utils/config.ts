abstract class Config {
  public urls = {
    auth: {
      signUp: "",
      signIn: "",
      googleSignIn: ""
    },
    users: "",
    invoices: "",
    categories: "",
    bank: {
      fetchBankData: "",
      updateBankData: "",
      importTransactions: "",
    }
  };

  public constructor(baseUrl: string) {
    this.urls = {
      auth: {
        signUp: baseUrl + "auth/signup",
        signIn: baseUrl + "auth/signin",
        googleSignIn: baseUrl + "auth/google"
      },
      users: baseUrl + "users/",
      invoices: baseUrl + "invoices",
      categories: baseUrl + "categories",
      bank: {
        fetchBankData: baseUrl + "bank-account/fetch-bank-data",
        updateBankData: baseUrl + "bank-account/update-bank-data",
        importTransactions: baseUrl + "bank-account/import-transactions",
      }
    }
  };
};

class DevelopmentConfig extends Config {
  public constructor() {
    // super("https://ea-numbers-server.vercel.app/api/");
    // super("https://ea-numbers-server-test.vercel.app/api/");
    // super("https://t2obu15q2h.execute-api.eu-central-1.amazonaws.com/");
    // super("https://c77d-2a0d-6fc2-5e61-1600-182b-ee57-d979-7cd3.ngrok-free.app/api/");
    // super("https://pup-hot-fully.ngrok-free.app/api/");
    super("http://127.0.0.1:5005/api/");
  };
};

class ProductionConfig extends Config {
  public constructor() {
    super(process.env.REACT_APP_BASE_URL);
  };
};

const config = process.env.NODE_ENV !== "production" ? new DevelopmentConfig() : new ProductionConfig();
export default config;