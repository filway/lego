import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import store from './store';
import router from './routes/index';

const app = createApp(App);
app.use(Antd).use(router).use(store);
app.mount('#app');
