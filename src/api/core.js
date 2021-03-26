/* eslint-disable no-unused-vars */
import axios from "axios";
import store from "@/store";
import config from "../../config/axios";

const instance = axios.create(config);

// 设置请求拦截器
instance.interceptors.request.use(
  (config) => {
    let token = store.getters.token;
    token && (config.headers["Authorization"] = token);
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 设置响应拦截器
instance.interceptors.response.use(
  (response) => {
    return { status: response.status, data: response.data };
  },
  (error) => {
    return Promise.reject({
      status: error.response.status,
      data: error.response.data,
    });
  }
);

export default instance;
