import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueCookies from "vue-cookies"
import axios from 'axios';
import swal from 'vue-sweetalert2';
import Scrollbar from 'vue-custom-scrollbar'
import Loading from 'vue-loading-overlay'

import './filters'
import './components'
import './styles/app.scss'
import 'sweetalert2/dist/sweetalert2.min.css';
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(swal)
Vue.use(Scrollbar)

Vue.component('Loading', Loading)

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

Vue.prototype.GLOBAL = App

Vue.prototype.reCn = /[^a-zA-Z0-9\u4e00-\u9fa5\ ]/gi // 中英數
Vue.prototype.reJp = /[^a-zA-Z0-9\u0800-\u4e00]/gi // 日英數
Vue.prototype.reEn = /[^a-zA-Z0-9\ ]/gi //英數
Vue.prototype.reMt = /[^0-9\ ]/gi //數
Vue.prototype.reHs = /[^a-zA-Z0-9\.\/]/gi //forHost

Vue.prototype.status = false
Vue.prototype.api = 'http://test777.ukyo.idv.tw/api'

Vue.prototype.checklogin = async function () {
  console.log(this.$route.path)
  if (VueCookies.get("token") != "" && VueCookies.get("token") != null) {
    await axios.post(`${this.api}/apitokencheck`, {
      api_token: VueCookies.get('token')
    }).then(async (res) => {
      await console.log(res);
      if (res.data.status != 200) {
        //登入超時
        this.status = false
        console.log("被踢");
        sessionStorage.clear();
        VueCookies.remove('token');
        VueCookies.remove("name");
      } else {
        //登入狀態
        this.status = true
        await sessionStorage.setItem('cellphone', res.data.result.cellphone);
        await sessionStorage.setItem('chmod', res.data.result.chmod);
        await sessionStorage.setItem('gender', res.data.result.gender);
        await sessionStorage.setItem('id', res.data.result.id);
        await sessionStorage.setItem('level', res.data.result.level);
        await sessionStorage.setItem('status', res.data.status);
        if (this.$route.path == "/login") {
          //已登入且在登入畫面
          this.$swal({
            title: "您已經登入囉",
            text: "3秒後將為您轉跳",
            icon: "info",
            timer: 3000,
            confirmButtonText: "確定",
          }).then(function () {
            window.location.href = "/main";
          });
        }
      }
    });
  } else {
    //未登入
    this.status = false
    console.log("未登入");
    sessionStorage.clear();
    VueCookies.remove("token");
    VueCookies.remove("name");
    if (this.$route.path != "/" && this.$route.path != "/login") {
      //未登入且在功能頁
      console.log("轉跳")
      this.$swal(
        {
          title: "尚未登入",
          text: "請先登入後再進行操作",
          icon: "error",
          timer: 3000,
          confirmButtonText: "登入"
        }).then(function () {
          window.location.href = "/login"
        })
    }
  }
}


Vue.prototype.logout = async function () {
  console.log(sessionStorage.getItem('id'))
  await axios.post(`${this.api}/logout`, {
    id: sessionStorage.getItem('id')
  }).then((res) => {
    console.log(res)
  })
  VueCookies.remove("token");
  VueCookies.remove("name");
  sessionStorage.clear();
  this.status = false;
  window.location.href = "/login";
}



new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')


