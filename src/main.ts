import { createApp } from 'vue';
import axios from 'axios';
import Antd from 'ant-design-vue';
import LegoBricks from 'filway-lego-components';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import store from './store';
import router from './routes/index';
import 'filway-lego-components/dist/bundle.css';
import 'cropperjs/dist/cropper.css';

const app = createApp(App);
const baseBackendURL = 'http://182.92.168.192:8081';
axios.defaults.baseURL = `${baseBackendURL}/api/`;
app.use(Antd).use(LegoBricks).use(router).use(store);
app.mount('#app');
