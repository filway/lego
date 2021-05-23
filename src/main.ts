import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import LegoBticks from 'filway-lego-components';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import store from './store';
import router from './routes/index';
import 'filway-lego-components/dist/bundle.css';
import 'cropperjs/dist/cropper.css';

const app = createApp(App);
app.use(Antd).use(LegoBticks).use(router).use(store);
app.mount('#app');
