<template>
  <div id="kollist" class="wrapper">
    <div id="filter" class="box">
      <h4>KOL list</h4>
      <p class="desc">This is a description for KOL list</p>
      <div>
        <b-row>
          <b-col cols="12" md="3">
            <b-form-input id="jobno" v-model="kolname" placeholder="KOL name" list="kolnameList"></b-form-input>
            <datalist id="kolnameList">
              <option v-for="data in kolnameList">{{ data }}</option>
            </datalist>
          </b-col>
          <b-col cols="12" md="3">
            <b-form-input
              id="jobno"
              v-model="foldername"
              placeholder="Folder name"
              list="foldernameList"
            ></b-form-input>
            <datalist id="foldernameList">
              <option v-for="data in foldernameList">{{ data }}</option>
            </datalist>
          </b-col>
          <b-col cols="12" md="3">
            <b-form-select id="plattfrom" v-model="plattfrom" :options="plattfromoptions">
              <option value="All platform">All platform</option>
            </b-form-select>
          </b-col>
        </b-row>
      </div>
      <ul id="tabs">
        <li class="open">
          <router-link to="/KOLlist" tag="a">KOL list</router-link>
        </li>
        <li>
          <router-link to="/MyFloder" tag="a">My folder</router-link>
        </li>
      </ul>
    </div>

    <div id="dataFilter">
      <div>
        <!-- <table class="table">
          <thead>
            <tr>
              <th v-for="(data, index) in fields" :key="index">
                <label class="form-checkbox" v-if="data.key=='select'">
                  <b-form-checkbox
                    id="checkbox-1"
                    v-model="selectAll"
                    name="checkbox-1"
                    @click="select(index+1)"
                  ></b-form-checkbox>
                  <i class="form-icon"></i>
                </label>
                {{data.label}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in kolData" :key="index">
              <td>
                <label class="form-checkbox">
                  <b-form-checkbox v-model="selected" name="checkbox-1" :value="data.id"></b-form-checkbox>
                  <i class="form-icon"></i>
                </label>
              </td>
              <td>{{data.kolname}}</td>
              <td>{{data.platform}}</td>
              <td>{{data.scope}}</td>
              <td>{{data.cost}}</td>
              <td>{{data.price}}</td>
              <td>{{data.margin}}</td>
              <td>{{data.remark}}</td>
              <td>{{data.timeline}}</td>
            </tr>
          </tbody>
        </table>-->
        <!-- <b-table :items="items" :fields="fields">
         <template v-slot:row-details="row">
            <b-form-checkbox>d</b-form-checkbox>
          </template>
        </b-table>-->
        <!-- {{selected}} -->
      </div>
    </div>

    <div id="footer-page" class="text-right">
      <button class="btn red delete">
        <i class="fa fa-trash-o"></i> Delete
      </button>
      <button class="btn red addtofolder" @click="openFolder">
        <i class="fa fa-plus-circle"></i>
        Add to folder
        <div class="foloerList">
          <a @click="openPopup('platform','add')">Create new folder</a>
          <ul>
            <li
              v-for="(data ,index) in foldernameList"
              :key="index"
              @click="openPopup('platform','edit',data)"
            >{{data}}</li>
          </ul>
        </div>
      </button>
      <button class="btn white exportxlsx" @click="openExport();">
        <i class="fa fa-file-excel-o"></i> Export to xlsx.
      </button>
    </div>

    <div class="popup folder" :id="type">
      <div :class="action">
        <h5 v-if="action=='add'">Create new folder</h5>
        <h5 v-if="action=='edit'">Edit folder</h5>
        <div class="form">
          <label>Folder name</label>
          <b-form-input v-model="addfoldername"></b-form-input>
          <label>Description</label>
          <b-form-input v-model="addfolderdescription"></b-form-input>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancle</button>
          <button class="btn red" v-if="action=='add'">Create</button>
          <button class="btn red" v-if="action=='edit'">Save</button>
        </div>
      </div>
    </div>

    <div class="popup export">
      <div>
        <h5>Export to excel file</h5>
        <div class="form-export">
          <b-form-group>
            <b-form-checkbox-group
              id="checkbox-export"
              v-model="exportselect"
              :options="exportList"
              name="checkbox-export"
              button-variant="info"
            ></b-form-checkbox-group>
          </b-form-group>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancle</button>
          <button class="btn red">
            <i class="fa fa-file-excel-o"></i> Export
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Autocomplete from "vuejs-auto-complete";
export default {
  components: {
    Autocomplete
  },
  data() {
    return {
      apitoken: this.$store.state.apitoken,
      kolname: "",
      kolnameList: [
        "ตามใจตุ้ด",
        "พี่เอ็ด7วิ",
        "กินไม่หยุด",
        "นี่หรือคนเมา",
        "ตามใจตุ้ด1",
        "พี่เอ็ด7วิ2",
        "กินไม่หยุด3",
        "นี่หรือคนเมา4"
      ],
      foldername: "",
      foldernameList: [
        "Folder KOL list 1",
        "Folder KOL list 2",
        "Folder KOL list 3",
        "Folder KOL list 4"
      ],
      plattfrom: "All platform",
      sizes: ["Small", "Medium", "Large", "Extra Large"],
      plattfromoptions: [
        "Facebook",
        "Youtube",
        "Twitter",
        "Instragram",
        "Website"
      ],
      kolData: [
        {
          id: "1589898",
          kolname: "ตามใจตุ้ด",
          platform: "Facebook",
          scope: "Create photo album post",
          cost: "5,500",
          price: "6,000",
          margin: "53 %",
          remark: "ถ่ายภาพทำ production ใหม่ (ไม่เกิน10ภาพ)",
          timeline: "3-5 days"
        },
        {
          id: "898656565",
          kolname: "พี่เอ็ด7วิ",
          platform: "Youtube",
          scope: "Create photo album post",
          cost: "9,000",
          price: "9,000",
          margin: "42 %",
          remark:
            "อัลบั้มละไม่เกิน 5 ภาพ อัลบั้มละไม่เกิน 5 ภาพ อัลบั้มละไม่เกิน 5 ภาพ",
          timeline: "10 days"
        }
      ],
      fields: [
        {
          key: "select",
          label: ""
        },
        {
          key: "kolname",
          label: "KOL name"
        },
        {
          key: "platform",
          label: "Platform"
        },
        {
          key: "scope",
          label: "Scope of work"
        },
        {
          key: "cost",
          label: "Cost (THB)"
        },
        {
          key: "price",
          label: "Price (THB)"
        },
        {
          key: "margin",
          label: "Margin (%)"
        },
        {
          key: "remark",
          label: "Remark"
        },
        {
          key: "timeline",
          label: "Timeline"
        }
      ],
      selected: [],
      selectAll: false,

      addfoldername: "",
      addfolderdescription: "",
      type: "",
      action: "",
      exportselect: "",
      exportList: [
        "KOL name",
        "Platform",
        "Scope of work",
        "Cost (THB)",
        "Price (THB)",
        "Remark",
        "Margin (%)",
        "Timeline"
      ]
    };
  },
  methods: {
    select(index) {
      this.selected = [];
      if (!this.selectAll) {
        for (let i in this.kolData) {
          this.selected.push(this.kolData[i].id);
        }
      } else {
      }
    },
    openFolder() {
      $(".addtofolder .foloerList").show();
    },
    openPopup(id, action, data) {
      $(".popup.folder").addClass("open");
      this.type = id;
      this.action = action;
      if (action == "add") {
        this.titletype = "Add new " + id;
      } else if (action == "edit") {
        this.titletype = "Edit " + id;
        this.name = data;
      }
    },
    openExport() {
      $(".popup.export").addClass("open");
    },
    closePopup() {
      $(".popup").removeClass("open");
      this.name = "";
      this.type = "";
      this.action = "";
    }
  },
  mounted() {
    //
  }
};
</script>