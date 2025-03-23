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
      setMainAccount: "",
      removeBankAccount: "",
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
      transactions: baseUrl + "transactions/",
      categories: baseUrl + "categories",
      bank: {
        fetchAllBanksAccounts: baseUrl + "banks/fetch-user-banks-accounts",
        fetchOneBankAccount: baseUrl + "banks/fetch-bank-account",
        connectBank: baseUrl + "banks/connect-bank",
        refreshBankData: baseUrl + "banks/refresh-bank-data",
        updateBankDetails: baseUrl + "banks/update-bank-details",
        importTransactions: baseUrl + "banks/import-transactions",
        setMainAccount: baseUrl + "banks/set-main-account",
        removeBankAccount: baseUrl + "banks/remove-bank"
      }
    }
  };
};

class DevelopmentConfig extends Config {
  public constructor() {
    super("http://localhost:5000/api/");
  };
};

class ProductionConfig extends Config {
  public constructor() {
    super(process.env.REACT_APP_BASE_URL);
  };
};

const config = process.env.NODE_ENV !== "production" ? new DevelopmentConfig() : new ProductionConfig();
export default config;