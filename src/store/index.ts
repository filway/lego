import axios, { AxiosRequestConfig } from 'axios';
import { forEach } from 'lodash-es';
import { createStore, ActionContext } from 'vuex';
import templates, { TemplatesProps } from './templates';
import user, { UserProps } from './user';
import editor, { EditorProps } from './editor';

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
}

export interface ActionPayload {
  urlParams?: { [key: string]: any };
  data?: any;
  searchParams?: { [key: string]: any };
}

const store = createStore({
  modules: {
    user,
    templates,
    editor,
  },
});

export default store;
