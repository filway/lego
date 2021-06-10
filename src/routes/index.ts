import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import { message } from 'ant-design-vue';
import Home from '../views/Home.vue';
import Editor from '../views/Editor.vue';
import TemplateDetail from '../views/TemplateDetail.vue';
import Index from '../views/Index.vue';
import Works from '../views/Works.vue';
import Login from '../views/Login.vue';
import store from '../store';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiredLogin?: boolean;
    redirectAlreadyLogin?: boolean;
    disableLoading?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: '', name: 'home', component: Home, meta: { title: '欢迎来到慕课乐高' },
        },
        {
          path: 'template/:id', name: 'template', component: TemplateDetail, meta: { title: '模版详情' },
        },
        {
          path: 'works', name: 'works', component: Works, meta: { title: '我的作品', requiredLogin: true },
        },
      ],
    },
    {
      path: '/editor/:id',
      name: 'editor',
      component: Editor,
      meta: { requiredLogin: true, title: '编辑我的设计' },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true, title: '登录到慕课乐高' },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const { user } = store.state;
  const { token, isLogin } = user;
  const { redirectAlreadyLogin, requiredLogin, title } = to.meta;
  if (title) {
    document.title = title;
  }
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        await store.dispatch('fetchCurrentUser');
        if (redirectAlreadyLogin) {
          return '/';
        }
      } catch {
        message.error('登陆状态已过期 请重新登陆', 2);
        store.commit('logout');
        return '/login';
      }
    } else if (requiredLogin) {
      return '/login';
    }
  } else if (redirectAlreadyLogin) {
    return '/';
  }
  return true;
});
export default router;
