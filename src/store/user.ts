import axios, { AxiosRequestConfig } from 'axios';
import { ActionContext, Module } from 'vuex';
import { GlobalDataProps } from './index';
import { RespData } from './respTypes';

export interface UserDataProps {
  username?: string;
  id?: string;
  phoneNumber?: string;
  nickName?: string;
  description?: string;
  updatedAt?: string;
  createdAt?: string;
  iat?: number;
  exp?: number;
  picture?: string;
  gender?: string;
}

export interface UserProps {
  isLogin: boolean;
  token?: string;
  data?: UserDataProps;
}

// 第二步，确定参数
// 第一步 不管三七二十一，先返回一个函数和原来的函数处理一摸一样;
const actionWrapper = (url: string, commitName: string, config: AxiosRequestConfig = { method: 'get' }) => async (context: ActionContext<any, any>, payload?: any) => {
  // 第三部 写内部重复的逻辑
  const newConfig = { ...config, data: payload };
  const { data } = await axios(url, newConfig);
  context.commit(commitName, data);
  return data;
};
const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
  },
  mutations: {
    login(state, rawData: RespData<{ token: string}>) {
      const { token } = rawData.data;
      state.token = token;
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    logout(state) {
      state.isLogin = false;
    },
    fetchCurrentUser(state, rawData: RespData<UserDataProps>) {
      state.isLogin = true;
      state.data = { ...rawData.data };
    },
  },
  actions: {
    login: actionWrapper('/users/loginByPhoneNumber', 'login', { method: 'post' }),
    // login({ commit }, payload) {
    //   return axios.post('/users/loginByPhoneNumber', payload).then((rawData) => {
    //     commit('login', rawData.data);
    //   });
    // },
    fetchCurrentUser: actionWrapper('/users/getUserInfo', 'fetchCurrentUser'),
    // fetchCurrentUser({ commit }) {
    //   return axios.get('/users/getUserInfo').then((rawData) => {
    //     commit('fetchCurrentUser', rawData.data);
    //   });
    // },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => dispatch('fetchCurrentUser'));
    },
  },
};

export default user;
