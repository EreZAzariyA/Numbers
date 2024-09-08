abstract class Config {
  public urls = {
    auth: {
      fetchUser: "",
      signup: "",
      signIn: "",
      googleSignIn: "",
      logout: ""
    },
    users: {
      config: {
        theme: "",
        language: ""
      }
    },
    transactions: "",
    categories: "",
    bank: {
      fetchAllBanksAccounts: "",
      fetchOneBankAccount: "",
      connectBank: "",
      refreshBankData: "",
      updateBankDetails: "",
      importTransactions: "",
    }
  };

  public constructor(baseUrl: string) {
    this.urls = {
      auth: {
        fetchUser: baseUrl + "auth/fetch-user",
        signup: baseUrl + "auth/signup",
        signIn: baseUrl + "auth/signin",
        googleSignIn: baseUrl + "auth/google",
        logout: baseUrl + "auth/logout",
      },
      users: {
        config: {
          theme: baseUrl + "users/config/theme",
          language: baseUrl + "users/config/language",
        }
      },
      transactions: baseUrl + "transactions",
      categories: baseUrl + "categories",
      bank: {
        fetchAllBanksAccounts: baseUrl + "banks/fetch-all-banks-accounts",
        fetchOneBankAccount: baseUrl + "banks/fetch-bank-account",
        connectBank: baseUrl + "banks/connect-bank",
        refreshBankData: baseUrl + "banks/refresh-bank-data",
        updateBankDetails: baseUrl + "banks/update-bank-details",
        importTransactions: baseUrl + "banks/import-transactions",
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