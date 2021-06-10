import { createApp } from 'vue';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Antd from 'ant-design-vue';
import LegoBricks from 'filway-lego-components';
import App from './App.vue';
import 'ant-design-vue/dist/antd.less';
import store from './store';
import router from './routes/index';
import 'filway-lego-components/dist/bundle.css';
import 'cropperjs/dist/cropper.css';
import { RespData } from './store/respTypes';

export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string;
}

const app = createApp(App);
let baseBackendURL = '';
let baseH5URL = '';
if (process.env.NODE_ENV === 'development' || process.env.VUE_APP_STAGING) {
  baseBackendURL = 'http://localhost:3000';
  baseH5URL = 'http://182.92.168.192:8082';
} else {
  baseBackendURL = 'http://localhost:3000';
  baseH5URL = 'http://182.92.168.192:8082';
}
export { baseH5URL, baseBackendURL };
axios.defaults.baseURL = `${baseBackendURL}/api/`;
axios.interceptors.request.use((config) => {
  const newConfig = config as ICustomAxiosConfig;
  store.commit('setError', { status: false, message: '' });
  store.commit('startLoading', { opName: newConfig.opName });
  return config;
});
axios.interceptors.response.use((resp: AxiosResponse<RespData>) => {
  const { config, data } = resp;
  const newConfig = config as ICustomAxiosConfig;
  store.commit('finishLoading', { opName: newConfig.opName });
  const { errno, message } = data;
  if (errno !== 0) {
    store.commit('setError', { status: true, message });
    return Promise.reject(data);
  }
  return resp;
}, (e: AxiosError) => {
  const newConfig = e.config as ICustomAxiosConfig;
  store.commit('setError', { status: true, message: '服务器错误' });
  store.commit('finishLoading', { opName: newConfig.opName });
  return Promise.reject(e);
});
app.use(Antd).use(LegoBricks).use(router).use(store);
app.mount('#app');
