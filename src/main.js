import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/routes'
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
