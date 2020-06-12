import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        apiURL: "https://apps.adapterdigital.com/KOLDirectory/api/",
        GoogleClientID: "307443028991-v8rp8bh3gq6a6145ncn8f7s2vrqd3cbi.apps.googleusercontent.com",
        loginEmail: localStorage.getItem("UserLogIn"), //sessionStorage.UserLogIn,
        emmail: localStorage.getItem("UserLogIn"), //sessionStorage.UserLogIn,
        apitoken: localStorage.getItem("UserToken"), //sessionStorage.UserToken,
        depGroup: localStorage.getItem("DepGroup"),
    }
});
