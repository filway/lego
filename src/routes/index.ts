import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Editor from '../views/Editor.vue';
import Login from '../views/Login.vue';
import TemplateDetail from '../views/TemplateDetail.vue';
import Index from '../views/Index.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: 'template/:id',
          name: 'template',
          component: TemplateDetail,
        },
      ],
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});

export default router;
