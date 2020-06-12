import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home.vue";
import Main from "./pages/Main.vue";
import RateCard from "./pages/RateCard.vue";
import KOLlist from "./pages/KOLlist.vue";
import MyFolder from "./pages/MyFolder.vue";
import Contact from "./pages/Contact.vue";
import Setting from "./pages/Setting.vue";
import Blank from "./pages/Blank.vue";


Vue.use(Router);

export const routesMap = [
  {
    path: "/",
    component: Home,
    name: "home",
    children: [{
      path: "/",
      component: Main,
      name: "Main",
      beforeEnter: checkAuth
    }, {
      path: "RateCard",
      component: RateCard,
      name: "RateCard",
      beforeEnter: requireAuth
    }, {
      path: "Contact",
      component: Contact,
      name: "Contact",
      beforeEnter: requireAuth
    }, {
      path: "Setting",
      component: Setting,
      name: "Setting",
      beforeEnter: requireAuth
    },
    {
      path: 'KOLlist',
      component: Blank,
      children: [{
        path: '',
        name: 'KOLlist',
        component: KOLlist,
        beforeEnter: requireAuth,
      },
      {
        path: 'MyFolder',
        name: 'MyFolder',
        component: MyFolder,
        beforeEnter: requireAuth,
      }
      ]
    }
    ],
    redirect: "/Main"
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login
  // },
  { path: "*", redirect: "/" }
];

function checkAuth(to, from, next) {
  if (localStorage.getItem("UserLogIn")) {
    next({
      path: '/RateCard'
    })
  } else {
    next()
  }
}

function requireAuth(to, from, next) {
  if (!localStorage.getItem("UserLogIn")) {
    next({
      path: '/login'
    })
  } else {
    CheckEmpPermission();
    next()
  }
}

import axios from "axios";
function CheckEmpPermission() {
  if (
    localStorage.UserToken !== "" &&
    localStorage.UserToken !== undefined
  ) {

    const filterPermission = {
      params: {
        apitoken: localStorage.UserToken,
        appid: "3F017BBB-3736-4BD6-BE7F-5F75F2200DB2"
      }
    };

    axios
      .get(
        `https://apps.adapterdigital.com/AvalonX/api/GetEmpInfo.aspx`,
        filterPermission
      )
      .then(({ data }) => {
        if (data.result == "complete") {
          localStorage.setItem("DepGroup", data.depgroup);
        } else {
          alert("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง");
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status == "403") {
            alert("fail");
          }
        }
      });
  }
}

export default new Router({
  mode: "hash", // https://router.vuejs.org/api/#mode
  linkActiveClass: "open active",
  scrollBehavior: () => ({
    y: 0
  }),
  routes: routesMap
});
