<template>
  <div id="setting" class="wrapper">
    <div id="filter" class="box">
      <h4>Setting</h4>
      <p class="desc">This is description for setting</p>
    </div>
    <b-row id="settinglist">
      <b-col cols="12" md="4">
        <div class="box">
          <button class="btn red addnew" @click="openPopup('platform','add')">
            <span>+</span> Add new
          </button>
          <h5>Platform</h5>
          <ul>
            <li v-for="(data,index) in platformList" :key="index">
              {{data}}
              <span>
                <i class="fa fa-pencil" @click="openPopup('platform','edit',data)"></i>
                <i class="fa fa-trash-o" @click="deleteData('platform', data)"></i>
              </span>
            </li>
          </ul>
        </div>
      </b-col>
      <b-col cols="12" md="4">
        <div class="box">
          <button class="btn red addnew" @click="openPopup('scope','add')">
            <span>+</span> Add new
          </button>
          <h5>Scope</h5>
          <ul>
            <li v-for="(data,index) in scopeList" :key="index">
              {{data}}
              <span>
                <i class="fa fa-pencil" @click="openPopup('scope','edit',data)"></i>
                <i class="fa fa-trash-o" @click="deleteData('scope', data)"></i>
              </span>
            </li>
          </ul>
        </div>
      </b-col>
      <b-col cols="12" md="4">
        <div class="box">
          <button class="btn red addnew" @click="openPopup('category','add')">
            <span>+</span> Add new
          </button>
          <h5>Category</h5>
          <ul>
            <li v-for="(data,index) in categoryList" :key="index">
              {{data}}
              <span>
                <i class="fa fa-pencil" @click="openPopup('category','edit',data)"></i>
                <i class="fa fa-trash-o" @click="deleteData('category', data)"></i>
              </span>
            </li>
          </ul>
        </div>
      </b-col>
    </b-row>

    <div class="popup" :id="type">
      <div :class="action">
        <h5>{{titletype}}</h5>
        <div class="form">
          <label>{{type}} name</label>
          <b-form-input v-model="name" placeholder></b-form-input>
        </div>
        <div class="text-center">
          <button class="btn red cancel" @click="closePopup()">Cancle</button>
          <button class="btn red" v-if="action=='add'">Add</button>
          <button
            class="btn red"
            v-if="action=='edit'"
            @click="editSave('platform', platformname)"
          >Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      apitoken: this.$store.state.apitoken,
      platformname: "",
      scopename: "",
      categoryname: "",
      name: "",
      type: "",
      action: "",
      titletype: "",
      platformList: ["Facebook", "Youtube", "Twitter", "Instragram", "Website"],
      scopeList: [
        "Boost post",
        "Create photo album post",
        "Create VDO content"
      ],
      categoryList: [
        "Beauty",
        "Fashion",
        "Financial",
        "Food & Dining",
        "Gaming",
        "Health & Fitness",
        "Family & Kids",
        "Lifestyle & Entertainment",
        "Online Program",
        "Pets",
        "Promotion",
        "Social News",
        "Travel",
        "Movie",
        "Music",
        "LCORHOR Drink",
        "Real estate",
        "Water & Mineral water",
        "Soft drink"
      ]
    };
  },
  methods: {
    openPopup(id, action, data) {
      $(".popup").addClass("open");
      this.type = id;
      this.action = action;
      if (action == "add") {
        this.titletype = "Add new " + id;
      } else if (action == "edit") {
        this.titletype = "Edit " + id;
        this.name = data;
      }
    },
    closePopup() {
      $(".popup").removeClass("open");
      this.name = "";
      this.type = "";
      this.action = "";
    },
    deleteData(cate, data) {
      console.log(cate, data);
    },
    editData(cate, data) {
      openPopup("edit" + cate);
      this.platformname = data;
    },
    editSave(cate, data) {
      const filter = {
        params: {
          apitoken: this.apitoken
        }
      };
      axios
        .get(`${this.$store.state.apiURL}roomlist.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
          } else if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else alert(data.detail);
        });
    }
  },
  mounted() {
    //
  }
};
</script>