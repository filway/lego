import axios from 'axios';
import { Module } from 'vuex';
import { actionWrapper, GlobalDataProps } from './index';
import { RespListData } from './respTypes';

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

export interface TemplatesProps {
  data: TemplateProps[];
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
  },
  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      state.data = rawData.data.list;
    },
  },
  actions: {
    fetchTemplates: actionWrapper('/templates', 'fetchTemplates'),
    // fetchTemplates(context) {
    //   return axios.get('/templates').then((resp) => {
    //     context.commit('fetchTemplates', resp.data);
    //   });
    // },
  },
  getters: {
    getTemplateById: (
      state,
    ) => (id: number) => state.data.find((t) => t.id === id),
  },
};

export default templates;
