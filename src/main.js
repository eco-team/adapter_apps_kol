import "@babel/polyfill";
import Vue from "vue";
import {
  store
} from "./store";


import router from "./router";
import App from "./App.vue";

import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.config.productionTip = false
Vue.use(Antd)


import VueExcelXlsx from "vue-excel-xlsx";
Vue.use(VueExcelXlsx);



window.$ = window.jQuery = require('jquery')
require("./assets/js/global");

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});