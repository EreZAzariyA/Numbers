import axios, { InternalAxiosRequestConfig } from "axios";
import { getError } from "../utils/helpers";
import store from "../redux/store";
import { logoutAction, refreshTokenAction } from "../redux/actions/auth-actions";
import config from "../utils/config";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

class InterceptorsService {
  public createInterceptors(): void {
    axios.interceptors.request.use((request) => {

      const token = store.getState().auth.token;
      if (!!token) {
        request.headers["Authorization"] = `Bearer ${token}`;
      }

      if (process.env.NODE_ENV === 'production') {
        request.headers["ngrok-skip-browser-warning"] = true;
      }
      request.withCredentials = true;

      return request;
    }, ((err) => console.log({ 'interceptorsService': err })));

    axios.interceptors.response.use((response) => {
      return response;
    }, async (err) => {
      const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

      const isRefreshRequest = originalRequest.url === config.urls.auth.refresh;
      if (err.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
        if (isRefreshing) {
          return new Promise<string>((resolve) => {
            refreshSubscribers.push((token: string) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(axios(originalRequest) as any);
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { token } = await store.dispatch(refreshTokenAction()).unwrap();
          refreshSubscribers.forEach(cb => cb(token));
          refreshSubscribers = [];
          isRefreshing = false;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        } catch {
          isRefreshing = false;
          refreshSubscribers = [];
          store.dispatch(logoutAction());
          return Promise.reject(getError(err));
        }
      }

      console.log({ 'interceptorsService': err });
      return Promise.reject(getError(err));
    });
  };
};

const interceptorsService = new InterceptorsService();
export default interceptorsService;
