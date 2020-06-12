<template>
  <div id="setting" class="wrapper">
    <div id="filter" class="box">
      <h4>Setting</h4>
      <p class="desc">This is description for setting</p>
    </div>

    <div id="settinglist">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-card title="Platform" :bordered="false">
            <a class="btn red addnew" @click="openPopup('platform','add')" slot="extra">
              <span>+</span> Add new
            </a>
            <ul>
              <li v-for="(data,index) in platformList" :key="index">
                {{data.title}}
                <span>
                  <i class="fa fa-pencil" @click="openPopup('platform','edit',data.title,data.id)"></i>

                  <a-popconfirm
                    :title="'Are you sure delete? '+ data.title"
                    @confirm="() => deleteData('platform', data.id)"
                  >
                    <i class="fa fa-trash-o"></i>
                  </a-popconfirm>
                </span>
              </li>
            </ul>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Scope" :bordered="false">
            <a class="btn red addnew" @click="openPopup('scope','add')" slot="extra">
              <span>+</span> Add new
            </a>
            <ul>
              <li v-for="(data,index) in scopeList" :key="index">
                {{data.title}}
                <span>
                  <i class="fa fa-pencil" @click="openPopup('scope','edit',data.title,data.id)"></i>
                  <a-popconfirm
                    :title="'Are you sure delete? '+ data.title"
                    @confirm="() => deleteData('scope', data.id)"
                  >
                    <i class="fa fa-trash-o"></i>
                  </a-popconfirm>
                </span>
              </li>
            </ul>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Category" :bordered="false">
            <a class="btn red addnew" @click="openPopup('category','add')" slot="extra">
              <span>+</span> Add new
            </a>
            <ul>
              <li v-for="(data,index) in categoryList" :key="index">
                {{data.title}}
                <span>
                  <i class="fa fa-pencil" @click="openPopup('category','edit',data.title,data.id)"></i>
                  <a-popconfirm
                    :title="'Are you sure delete? '+ data.title"
                    @confirm="() => deleteData('category', data.id)"
                  >
                    <i class="fa fa-trash-o"></i>
                  </a-popconfirm>
                </span>
              </li>
            </ul>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div class="popup" :id="type">
      <div :class="action">
        <h5>{{titletype}}</h5>
        <div class="form">
          <label>{{type}} name</label>
          <a-input v-model="name" maxlength="50" id="name" @keyup="handlerKeyup" />
        </div>
        <div class="form" v-if="type=='platform'">icon</div>
        <div class="form" v-if="type=='platform'">
          <label>performance index1</label>
          <a-input v-model="param1" maxlength="50" id="param1" @keyup="handlerKeyup" />
        </div>
        <div class="form" v-if="type=='platform'">
          <label>performance index2</label>
          <a-input v-model="param2" maxlength="50" id="param2" @keyup="handlerKeyup" />
        </div>
        <div class="text-right">
          <a class="btn red cancel" @click="closePopup()">Cancel</a>
          <a class="btn red" v-if="action=='add'" @click="addSetting">Add</a>
          <a class="btn red" v-if="action=='edit'" @click="editSave">Save</a>
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
      platformList: [],
      scopeList: [],
      categoryList: [],
      item_id: "",
      param1: "",
      param2: ""
    };
  },
  methods: {
    openPopup(id, action, data, item_id) {
      $(".popup").addClass("open");
      this.type = id;
      this.action = action;
      this.item_id = item_id;
      if (action == "add") {
        this.titletype = "Add new " + id;
      } else if (action == "edit") {
        this.titletype = "Edit " + id;
        this.name = data;

        if (this.type == "platform") {
          const platformSelect = this.platformList.find(x => x.id === item_id);
          this.param1 = platformSelect.param1;
          this.param2 = platformSelect.param2;
        }
      }
    },
    closePopup() {
      $(".popup").removeClass("open");
      this.name = "";
      this.type = "";
      this.action = "";
      this.item_id = "";
      this.param1 = "";
      this.param2 = "";
      $(".popup")
        .find(".require")
        .removeClass("require");
    },
    editData(cate, data) {
      openPopup("edit" + cate);
      this.platformname = data;
    },
    addSetting() {
      // if (this.type == "platform") {
      //   if (this.name == "") $("#name").addClass("require");
      //   if (this.param1 == "") $("#param1").addClass("require");
      //   if (this.param2 == "") $("#param2").addClass("require");
      //   if ($(".popup .require").length !== 0) {
      //     return;
      //   }
      // } else {
      //   if (this.name == "") $("#name").addClass("require");
      //   if ($(".popup .require").length !== 0) {
      //     return;
      //   }
      // }
      if (this.name.replace(/\s/g, "") == "") $("#name").addClass("require");
      if ($(".popup .require").length !== 0) {
        return;
      }

      showOverlay();
      const filter = {
        params: {
          apitoken: this.apitoken,
          itemtype: this.type,
          data1: this.name.replace(/\s/g, ""),
          param1: this.param1.replace(/\s/g, ""),
          param2: this.param2.replace(/\s/g, "")
        }
      };
      axios
        .get(`${this.$store.state.apiURL}setting/itemAdd.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            // alert("complete");
          } else if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else alert(data.detail);

          closePopup();
          this.filterdata();
        });
    },
    editSave(cate, data, item_id) {
      if (this.name.replace(/\s/g, "") == "") $("#name").addClass("require");
      if ($(".popup .require").length !== 0) {
        return;
      }
      showOverlay();
      const filter = {
        params: {
          apitoken: this.apitoken,
          itemtype: this.type,
          dataid: this.item_id,
          data1: this.name,
          param1: this.param1,
          param2: this.param2
        }
      };

      axios
        .get(`${this.$store.state.apiURL}setting/itemEdit.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            // alert("edit complete");
          } else if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else alert(data.detail);

          closePopup();
          this.filterdata();
        });
    },
    deleteData(itemtype, dataid) {
      // if (confirm("Do you want to Delete") == true) {
      //   this.deleteConfirm(itemtype, dataid);
      // } else {
      //   closePopup();
      // }
      this.deleteConfirm(itemtype, dataid);
    },
    deleteConfirm(itemtype, dataid) {
      const filter = {
        params: {
          apitoken: this.apitoken,
          itemtype: itemtype,
          dataid: dataid
        }
      };

      axios
        .get(`${this.$store.state.apiURL}setting/itemDelete.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            // alert("delete complete");
          } else if (data.detail == "invalid_apitoken") {
            this.invalid_apitoken();
          } else if (data.result == "error" && data.detail == "item_inused") {
            alert("ไม่สามารถลบได้ เพราะมีการใช้งานแล้ว");
          } else {
            alert(data.detail);
          }
          closePopup();
          this.filterdata();
        });
    },
    filterdata() {
      showOverlay();
      const filter = {
        params: {
          apitoken: this.apitoken,
          itemtype: "platform"
        }
      };
      const filterscope = {
        params: {
          apitoken: this.apitoken,
          itemtype: "scope"
        }
      };

      const filtercategory = {
        params: {
          apitoken: this.apitoken,
          itemtype: "category"
        }
      };
      Promise.all([
        axios
          .get(`${this.$store.state.apiURL}setting/itemView.aspx`, filter)
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") this.invalid_apitoken();
            else this.platformList = data.item;
          }),
        axios
          .get(`${this.$store.state.apiURL}setting/itemView.aspx`, filterscope)
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") this.invalid_apitoken();
            else this.scopeList = data.item;
          }),
        axios
          .get(
            `${this.$store.state.apiURL}setting/itemView.aspx`,
            filtercategory
          )
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") this.invalid_apitoken();
            else this.categoryList = data.item;
          })
      ]).then(({ data }) => {
        hideOverlay();
      });
    },
    handlerKeyup(event) {
      const _this = this;
      const id = event.target.id;
      $("#" + id).removeClass("require");
      console.log(id);
    }
  },
  mounted() {
    this.filterdata();
  }
};
</script>