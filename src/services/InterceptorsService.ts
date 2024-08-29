import axios from "axios";
import store from "../redux/store";
import { logoutAction } from "../redux/actions/authentication";
import { getError } from "../utils/helpers";
import { message } from "antd";

class InterceptorsService {
  public createInterceptors(): void {
    axios.interceptors.request.use((request) => {
      const token = store.getState().auth.token;
      if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
      }

      request.headers["ngrok-skip-browser-warning"] = true;

      return request;
    }, ((err) => console.log(err)));

    axios.interceptors.response.use((response) => {
      return response;
    }, (err) => {
      if (err.response?.status === 401) {
        message.info('Please login again')
        return store.dispatch(logoutAction());
      }
      return message.error(getError(err));
    });
  };
};

const interceptorsService = new InterceptorsService();
export default interceptorsService;