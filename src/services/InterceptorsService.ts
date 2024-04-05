import axios from "axios";
import store from "../redux/store";
import { logoutAction } from "../redux/slicers/auth-slicer";
import { message } from "antd";
import { getError } from "../utils/helpers";

class InterceptorsService {

  public createInterceptors(): void {
    axios.interceptors.request.use((request)=>{
      const token = store.getState().auth.token;

      if (token) {
        request.headers.set('authorization', "Bearer " + token);
      }

      return request;
    }, ((err) => {
      console.log(err);
    }));

    axios.interceptors.response.use((response) => {
      return response;
    }, (err) => {
      if (err.response?.status === 401) {
        store.dispatch(logoutAction());
      }
      return message.error(getError(err));
    });
  };

};

const interceptorsService = new InterceptorsService();
export default interceptorsService;