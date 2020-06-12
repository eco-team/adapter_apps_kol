<template>
  <div id="kollist" class="wrapper">
    <div id="filter" class="box">
      <h4>KOL list</h4>
      <p class="desc">This is a description for KOL list</p>
      <div>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-auto-complete
              :dataSource="KOLnameList"
              v-model="kolname"
              placeholder="KOL name"
              :filterOption="filterOption"
              @select="onSelectKol"
              @change="onFilter"
            />
          </a-col>
          <a-col :span="6">
            <a-auto-complete
              :dataSource="flodernameList"
              v-model="foldername"
              placeholder="Folder name"
              :filterOption="filterOption"
              @select="onSelectKol"
              @change="onFilter"
            />
          </a-col>
          <a-col :span="4">
            <a-select v-model="platform" @change="SearchKolByPlatform">
              <a-select-option value>All platfrom</a-select-option>
              <a-select-option
                v-for="data in platformList"
                :key="data.platformid"
                :value="data.id"
              >{{data.title}}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>
      <ul id="tabs">
        <li>
          <router-link :to="{ name: 'KOLlist'}" tag="a">KOL list</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'MyFolder'}" tag="a">My folder</router-link>
        </li>
      </ul>
    </div>
    <div v-if="kollistData.length == 0" class="notdata">Not Found</div>

    <div id="dataFilter">
      <div id="kolall">
        <a-table
          :rowSelection="rowSelection"
          :columns="columnsKollist"
          :dataSource="kollistData"
          :pagination="true"
        >
          <span slot="cost" slot-scope="cost">{{cost | addComma}}</span>
          <span slot="price" slot-scope="price">{{price | addComma}}</span>
          <span slot="margin" slot-scope="margin">{{margin}}%</span>
          <span
            slot="platformid"
            slot-scope="platformid"
          >{{platformid | checkIdPlatform(platformList)}}</span>
        </a-table>
      </div>
    </div>

    <div id="footer-page" class="text-right">
      <button
        class="btn red delete"
        @click="jobRemoveFromMyList"
        v-bind:class="{ disabled : this.selectedRowKeys.length ==0 }"
      >
        <i class="fa fa-trash-o"></i> Delete
      </button>
      <button
        class="btn red addtofolder"
        @click="openFolder"
        v-bind:class="{ disabled : this.selectedRowKeys.length ==0 }"
      >
        <i class="fa fa-plus-circle"></i>
        Add to folder
        <div class="foloerList">
          <a @click="openPopup('platform','add')">Create new folder</a>
          <ul>
            <li
              v-for="(data ,index) in folderList"
              :key="index"
              @click="jobAddToMyFolder(data.workspaceid)"
            >{{data.foldername}}</li>
          </ul>
        </div>
      </button>
      <button
        class="btn white exportxlsx"
        @click="openExport();"
        v-bind:class="{ disabled : this.selectedRowKeys.length ==0 }"
      >
        <i class="fa fa-file-excel-o"></i> Export to xlsx.
      </button>
    </div>

    <div class="popup export">
      <div>
        <h5>Export to excel file</h5>
        <div class="form-export">
          <a-checkbox-group @change="onCheckExport" v-model="checkedList">
            <a-row :gutter="24">
              <a-col :span="8" v-for="data in exportList" :key="data.field">
                <a-checkbox :value="data">{{data.label}}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancel</button>

          <button class="btn red" @click="exportSubmit" v-if="checkedList.length==0">
            <i class="fa fa-file-excel-o"></i> Export
          </button>

          <vue-excel-xlsx
            class="btn btn-default red"
            v-if="checkedList.length >0 "
            :data="selectedRows"
            :columns="checkedList"
            :filename="'KOLlist'"
            :sheetname="'sheetname'"
          >
            <i class="fa fa-file-excel-o"></i> Export
          </vue-excel-xlsx>
        </div>
      </div>
    </div>

    <div class="popup folder" :id="type">
      <div :class="action">
        <h5 v-if="action=='add'">Create new folder</h5>
        <h5 v-if="action=='edit'">Edit folder</h5>
        <div class="form">
          <a-row :gutter="24">
            <a-col :span="24">
              <label>Folder name</label>
            </a-col>
            <a-col :span="24">
              <a-input
                id="addfoldername"
                v-model="addfoldername"
                placeholder
                @keyup="handlerKeyup"
              />
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <label>Description</label>
            </a-col>
            <a-col :span="24">
              <a-input
                id="addfolderdescription"
                v-model="addfolderdescription"
                @keyup="handlerKeyup"
                placeholder
              />
            </a-col>
          </a-row>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancel</button>
          <button class="btn red" v-if="action=='add'" @click="myFolderAdd()">Create</button>
          <button class="btn red" v-if="action=='edit'">Save</button>
        </div>
      </div>
    </div>

    <!-- <popupFloder
      :id="type"
      :addfoldername="addfoldername"
      :addfolderdescription="addfolderdescription"
      v-on:closePopup="closePopup"
      v-on:keyup="handlerKeyup"
      :action="action"
    />-->
  </div>
</template>

<script>
import axios from "axios";
import popupFloder from "../components/popupFloder.vue";

export default {
  components: {
    popupFloder
    // downloadExcel: JsonExcel
  },
  data() {
    return {
      apitoken: this.$store.state.apitoken,
      kolname: "",
      KOLnameList: [],
      flodernameList: [],
      foldername: "",
      folderList: [],
      platform: "",
      platformList: [],
      sizes: ["Small", "Medium", "Large", "Extra Large"],
      selected: [],
      selectAll: false,

      addfoldername: "",
      addfolderdescription: "",
      type: "",
      action: "",
      // label: "Price", field: "price",
      exportList: [
        { label: "KOL name", field: "kolname", id: 1 },
        { label: "Platform", field: "platform", id: 2 },
        { label: "Scope of work", field: "scope", id: 3 },
        { label: "Cost (THB)", field: "cost", id: 4 },
        { label: "Price (THB)", field: "price", id: 5 },
        { label: "Margin (%)", field: "margin", id: 6 },
        { label: "Remark", field: "remark", id: 7 },
        { label: "Timeline", field: "timeline", id: 8 }
      ],
      checkedList: [],
      columnsKollist,
      selectedRowKeys: [],
      selectedRows: [],
      selectedRowsbyColum: [],
      exportKolData: [],
      kollistData: [],
      json_fields: {},
      json_data: [],
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8"
          }
        ]
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
      $(".addtofolder .foloerList").hide();
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    openExport() {
      if (this.selectedRows.length == 0) {
        alert("Select KOL");
        return;
      }
      this.groupDataBySelect();
      $(".popup.export").addClass("open");
    },
    groupDataBySelect() {
      var selectedRows = this.selectedRows;
      var checkedList = this.checkedList;

      var checkedList_ = checkedList.sort(function(a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });
      var selectedRowsData = this.groupBy(selectedRows, checkedList_, "Value");
      this.exportKolData = selectedRowsData;
    },
    groupBy(array, groups, valueKey) {
      var map = new Map();
      groups = [].concat(groups);
      return array.reduce((r, o) => {
        groups.reduce((m, k, i, { length }) => {
          var child;
          if (m.has(o[k])) return m.get(o[k]);
          if (i + 1 === length) {
            child = Object.assign(...groups.map(k => ({ [k]: o[k] })));
            r.push(child);
          } else {
            child = new Map();
          }
          m.set(o[k], child);
          return child;
        }, map);
        return r;
      }, []);
    },

    closePopup() {
      $(".addtofolder .foloerList").hide();
      $(".popup").removeClass("open");
      $(".popup")
        .find(".require")
        .removeClass("require");
      this.name = "";
      this.type = "";
      this.action = "";
      this.addfoldername = "";
      this.addfolderdescription = "";
      this.checkedList = this.exportList;
    },
    onCheckExport(checkedValues) {
      this.groupDataBySelect();
    },
    exportSubmit() {
      if (this.checkedList == "") {
        alert("กรุณาเลือกข้อมูลที่ต้องการ");
      } else {
        var _json_fields = this.checkedList.map(obj => {
          var rObj = {};
          rObj[obj.title] = obj.type;
          return rObj;
        });
        var json_fields = _json_fields.reduce(function(result, item) {
          var key = Object.keys(item)[0]; //first property: a, b, c
          result[key] = item[key];
          return result;
        }, {});

        this.json_fields = json_fields;
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    filterSetting() {
      showOverlay();
      const filter = {
        params: {
          apitoken: this.apitoken
        }
      };

      const filterplatform = {
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
          .get(`${this.$store.state.apiURL}myKOL/myFolderList.aspx`, filter)
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") this.invalid_apitoken();
            else {
              this.folderList = data.folder;

              const _flodernameList = data.folder.map(obj => {
                return obj.foldername;
              });
              this.flodernameList = _flodernameList;
            }
          }),
        axios
          .get(
            `${this.$store.state.apiURL}setting/itemView.aspx`,
            filterplatform
          )
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") this.invalid_apitoken();
            else {
              const platformList = data.item.map(obj => {
                var _platformList = {};
                _platformList = obj.title;
                return _platformList;
              });
              this.platformList = data.item;
            }
          }),
        axios
          .get(`${this.$store.state.apiURL}setting/itemView.aspx`, filterscope)
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") this.invalid_apitoken();
            // else this.scopeList = data.item;
          }),
        axios
          .get(
            `${this.$store.state.apiURL}setting/itemView.aspx`,
            filtercategory
          )
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") this.invalid_apitoken();
            else {
              const categoryList = data.item.map(obj => {
                var _categoryList = {};
                _categoryList = obj.title;
                return _categoryList;
              });
              this.categoryList = categoryList;
              this.categoryortagList = categoryList;
            }
          })
      ]).then(({ data }) => {
        // hideOverlay();
        this.filterKollist();
      });
    },
    filterKollist() {
      showOverlay();

      const filter = {
        params: {
          apitoken: this.apitoken,
          kolname: this.kolname,
          foldername: this.foldername,
          platformid: this.platform
        }
      };
      axios
        .get(`${this.$store.state.apiURL}myKOL/myKOLView.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            var result = data.profile
              .map(value =>
                value.platform.map(child =>
                  Object.assign(
                    { profileid: value.profileid },
                    { kolname: value.kolname },
                    { kolpic: value.kolpic },
                    { platformid: child.platformid },
                    { kolplatformid: child.kolplatformid },
                    { url: child.url },
                    { param1: child.param1 },
                    { param1value: child.param1value },
                    { param2: child.param2 },
                    { param2value: child.param2value },
                    {
                      job: child.job
                    }
                  )
                )
              )
              .reduce((l, n) => l.concat(n), []);

            var kollist = Object.values(result)
              .map(value =>
                value.job.map(child =>
                  Object.assign(
                    { profileid: value.profileid },
                    { kolname: value.kolname },
                    { kolpic: value.kolpic },
                    { url: value.url },
                    { param1: value.param1 },
                    { param1value: value.param1value },
                    { param2: value.param2 },
                    { param2value: value.param2value },
                    { platformid: value.platformid },
                    { kolplatformid: value.kolplatformid },
                    {
                      key: child.jobid,
                      cost: child.cost,
                      creditterm: child.creditterm,
                      discount: child.discount,
                      email: child.email,
                      jobid: child.jobid,
                      jobno: child.jobno,
                      lineid: child.lineid,
                      mobile: child.mobile,
                      price: child.price,
                      product: child.product,
                      ratecost: child.ratecost,
                      remark: child.remark,
                      salename: child.salename,
                      scope: child.scope,
                      workingtime: child.workingtime,
                      margin: child.margin
                    }
                  )
                )
              )
              .reduce((l, n) => l.concat(n), []);

            this.kollistData = Object.values(kollist);
            // console.log(this.kollistData);

            // kolnameList
            const _KOLnameList = data.profile.map(obj => {
              return obj.kolname;
            });
            this.KOLnameList = _KOLnameList;
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.closePopup();
          hideOverlay();
        });
    },
    filterKollistByfilter() {
      const filter = {
        params: {
          apitoken: this.apitoken,
          kolname: this.kolname,
          foldername: this.foldername,
          platformid: this.platform
        }
      };
      axios
        .get(`${this.$store.state.apiURL}myKOL/myKOLView.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            var result = data.profile
              .map(value =>
                value.platform.map(child =>
                  Object.assign(
                    { profileid: value.profileid },
                    { kolname: value.kolname },
                    { kolpic: value.kolpic },
                    { platformid: child.platformid },
                    { kolplatformid: child.kolplatformid },
                    { url: child.url },
                    { param1: child.param1 },
                    { param1value: child.param1value },
                    { param2: child.param2 },
                    { param2value: child.param2value },
                    {
                      job: child.job
                    }
                  )
                )
              )
              .reduce((l, n) => l.concat(n), []);

            var kollist = Object.values(result)
              .map(value =>
                value.job.map(child =>
                  Object.assign(
                    { profileid: value.profileid },
                    { kolname: value.kolname },
                    { kolpic: value.kolpic },
                    { url: value.url },
                    { param1: value.param1 },
                    { param1value: value.param1value },
                    { param2: value.param2 },
                    { param2value: value.param2value },
                    { platformid: value.platformid },
                    { kolplatformid: value.kolplatformid },
                    {
                      key: child.jobid,
                      cost: child.cost,
                      creditterm: child.creditterm,
                      discount: child.discount,
                      email: child.email,
                      jobid: child.jobid,
                      jobno: child.jobno,
                      lineid: child.lineid,
                      mobile: child.mobile,
                      price: child.price,
                      product: child.product,
                      ratecost: child.ratecost,
                      remark: child.remark,
                      salename: child.salename,
                      scope: child.scope,
                      workingtime: child.workingtime,
                      margin: child.margin
                    }
                  )
                )
              )
              .reduce((l, n) => l.concat(n), []);

            this.kollistData = Object.values(kollist);
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
        });
    },
    myFolderAdd() {
      $(".addtofolder .foloerList").hide();

      showOverlay();

      if (this.addfoldername.replace(/\s/g, "") == "")
        $("#addfoldername").addClass("require");
      if (this.addfolderdescription.replace(/\s/g, "") == "")
        $("#addfolderdescription").addClass("require");
      if ($(".popup .require").length !== 0) {
        hideOverlay();
        return;
      }

      const filter = {
        params: {
          apitoken: this.apitoken,
          foldername: this.addfoldername,
          description: this.addfolderdescription
        }
      };
      axios
        .get(`${this.$store.state.apiURL}myKOL/myFolderAdd.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            this.filterSetting();
            this.closePopup();
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);

          hideOverlay();
        });
    },
    jobRemoveFromMyList() {
      if (this.selectedRows.length == 0) {
        alert("Select KOL");
        return;
      }
      showOverlay();

      const filter = {
        params: {
          apitoken: this.apitoken,
          jobid: this.selectedRowKeys.join("|")
        }
      };

      axios
        .get(
          `${this.$store.state.apiURL}myKOL/jobRemoveFromMyList.aspx`,
          filter
        )
        .then(({ data }) => {
          if (data.result == "complete") {
            this.resetSelectRow();
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);

          this.filterKollist();
          this.closePopup();
          hideOverlay();
        });
    },
    jobAddToMyFolder(workspaceid) {
      if (this.selectedRows.length == 0) {
        alert("Select KOL");
        return;
      }

      const filter = {
        params: {
          apitoken: this.apitoken,
          workspaceid: workspaceid,
          jobid: this.selectedRowKeys.join("|")
        }
      };

      axios
        .get(`${this.$store.state.apiURL}myKOL/jobAddToMyFolder.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            // this.kolnameList = data.profile;
            this.$router.push({ name: "MyFolder" });
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          // this.filterKollist();
          this.closePopup();
          hideOverlay();
        });
    },
    checkIdPlatform(platformid) {
      const _platform = this.platformList.find(x => x.id === platformid);
      return _platform.title.toLowerCase();
    },
    onSelectKol(value) {
      this.filterKollistByfilter();
    },
    SearchKolByPlatform() {
      this.filterKollistByfilter();
    },
    onFilter() {
      clearTimeout(typingTimer);
      window.typingTimer = setTimeout(
        function() {
          this.filterKollistByfilter();
        }.bind(this),
        doneTypingInterval
      );
    },
    priceFormat(value) {
      return "$ " + value;
    },
    handlerKeyup(event) {
      const _this = this;
      const id = event.target.id;
      $("#" + id).removeClass("require");
    },
    resetSelectRow() {
      setTimeout(() => {
        this.selectedRowKeys = [];
      }, 100);
    }
  },
  filters: {
    checkIdPlatform(platformid, platformList) {
      const _platform = platformList.find(x => x.id === platformid);
      return _platform.title.toLowerCase();
    },
    getClassMargin(margin) {
      if (margin < 37) {
        return "red";
      } else return "";
    },
    addComma(value) {
      return (parseInt(value) + "").replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
  },
  mounted() {
    localStorage.removeItem("mykolcount");
    this.filterSetting();
    this.checkedList = this.exportList;
    this.exportSubmit();
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          const _selectedRows = selectedRows.map(kol => ({
            kolname: kol.kolname,
            platform: this.checkIdPlatform(kol.platformid, this.platformList),
            scope: kol.scope,
            cost: kol.cost,
            price: kol.price,
            margin: kol.margin,
            remark: kol.remark,
            timeline: kol.workingtime
          }));
          this.selectedRows = _selectedRows;

          const _selectedRowsCol = this.selectedRows.map(kol => ({
            "KOL name": kol.kolname,
            Platform: kol.platform,
            "Scope of work": kol.scope,
            "Cost (THB)": kol.cost,
            "Price (THB)": kol.price,
            "Margin (%)": kol.margin,
            Remark: kol.remark,
            Timeline: kol.timeline
          }));

          this.selectedRowsbyColum = _selectedRowsCol;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name
          }
        })
      };
    }
  }
};
</script>