import axios from "axios";
import { getError } from "../utils/helpers";
import store from "../redux/store";
import { logoutAction } from "../redux/actions/auth-actions";

class InterceptorsService {
  public createInterceptors(): void {
    axios.interceptors.request.use((request) => {
      const token = store.getState().auth.token;
      if (!!token) {
        request.headers["Authorization"] = `Bearer ${token}`;
      }
      request.withCredentials = true;

      return request;
    }, ((err) => console.log(err)));

    axios.interceptors.response.use((response) => {
      return response;
    }, (err) => {
      if (err.response?.status === 401) {
        store.dispatch(logoutAction());
      }
      return Promise.reject(getError(err));
    });
  };
};

const interceptorsService = new InterceptorsService();
export default interceptorsService;