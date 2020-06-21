import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Vue from 'vue';
import App from './App';
import router from './routes';

Vue.use(BootstrapVue);

export const eventBus = new Vue();

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
