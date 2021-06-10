import axios from 'axios';
import { Module } from 'vuex';
import { PageData } from './editor';
import { actionWrapper, GlobalDataProps } from './index';
import { RespData, RespListData } from './respTypes';

export type TemplateProps = Required<Omit<PageData, 'props' | 'setting'>>

export interface TemplatesProps {
  data: TemplateProps[];
  totalTemplates: number;
  works: TemplateProps[];
  totalWorks: number;
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
    totalTemplates: 0,
    works: [],
    totalWorks: 0,
  },
  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      const { count, list } = rawData.data;
      state.data = [...state.data, ...list];
      state.totalTemplates = count;
    },
    fetchWorks(state, rawData: RespListData<TemplateProps>) {
      const { count, list } = rawData.data;
      state.works = list;
      state.totalWorks = count;
    },
    fetchTemplate(state, rawData: RespData<TemplateProps>) {
      state.data = [rawData.data];
    },
    createWork(state, { data }: RespData<TemplateProps>) {
      state.works = [...state.works, data];
      state.totalWorks += 1;
    },
  },
  actions: {
    fetchTemplates: actionWrapper('/templates', 'fetchTemplates'),
    fetchWorks: actionWrapper('/works', 'fetchWorks'),
    fetchTemplate: actionWrapper('/templates/:id', 'fetchTemplate'),
    createWork: actionWrapper('/works', 'createWork', { method: 'post' }),
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
