<template>
  <div id="kollist" class="wrapper">
    <div id="filter" class="box">
      <a class="btn red addnew" @click="openPopup('folder','add')">
        <span>+</span> Create new folder
      </a>
      <h4>Floder KOL list</h4>
      <p class="desc">This is a description for folder KOL list</p>
      <div>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-auto-complete
              :dataSource="KOLnameList"
              v-model="kolname"
              placeholder="KOL name"
              :filterOption="filterOption"
              @select="onSelectFilterKolname"
              @change="onFilter"
            />
          </a-col>
          <a-col :span="6">
            <a-auto-complete
              :dataSource="folderNameList"
              v-model="foldername"
              placeholder="Folder name"
              :filterOption="filterOption"
              @select="onSelectFilterFoldername"
              @change="onFilter"
            />
          </a-col>
          <a-col :span="4">
            <a-select v-model="platform" @change="SearchKolByPlatform">
              <a-select-option value>All platfrom</a-select-option>
              <a-select-option v-for="data in platformList" :key="data.id">{{data.title}}</a-select-option>
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

    <div v-if="folderList.length == 0" class="notdata">Not found</div>

    <div id="dataFilter">
      <ul id="datainfolder" class="collapse-table">
        <li
          v-for="(folder,index) in folderList"
          :key="index"
          :id="'floder_'+index"
          :class="{ open: index==0,disabled : folder.profile==''}"
        >
          <div class="head">
            <div @click="openFolder(index)" class="header-desc">
              <span class="icon right">
                <a-icon type="caret-right" />
              </span>
              <span class="icon down">
                <a-icon type="caret-down" />
              </span>
              <span class="folder-open">
                <a-icon type="folder-open" />
              </span>

              <span class="foldername">{{folder.foldername}}</span>
              <span class="description">{{folder.description}}</span>
            </div>
            <div class="action">
              <i
                class="fa fa-pencil"
                @click="openPopup('folder','edit',folder.foldername,folder.description,folder.folderid)"
              ></i>

              <a-popconfirm
                title="Are you sure delete?"
                @confirm="myFolderDelete(folder.folderid)"
                cancelText="No"
                okText="Yes"
              >
                <i class="fa fa-trash-o"></i>
              </a-popconfirm>
            </div>
          </div>
          <div class="detail">
            <a-table
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              :columns="columnsKollist"
              :dataSource="folder.profile"
              :pagination="false"
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
        </li>
      </ul>
    </div>

    <div id="footer-page" class="text-right">
      <button
        class="btn red delete"
        @click="jobRemoveFromMyFolder()"
        v-bind:class="{ disabled : this.selectedRowKeys.length ==0 }"
      >
        <i class="fa fa-trash-o"></i> Delete
      </button>

      <button
        class="btn white exportxlsx"
        @click="openExport();"
        v-bind:class="{ disabled : this.selectedRowKeys.length ==0 }"
      >
        <i class="fa fa-file-excel-o"></i> Export to xlsx.
      </button>
    </div>

    <div class="popup folder" :id="type">
      <div :class="action">
        <h5 v-if="action=='add'">Create new folder</h5>
        <h5 v-if="action=='edit'">Edit folder</h5>
        <div class="form">
          <a-row :gutter="24">
            <a-col :span="24">
              <label>Folder name</label>
              <a-input
                v-model="addfoldername"
                id="addfoldername"
                maxlength="50"
                @keyup="handlerKeyup"
              />
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <label>Description</label>
              <a-input
                v-model="addfolderdescription"
                id="addfolderdescription"
                maxlength="50"
                @keyup="handlerKeyup"
              />
            </a-col>
          </a-row>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancel</button>
          <button class="btn red" v-if="action=='add'" @click="createFolder">Create</button>
          <button class="btn red" v-if="action=='edit'" @click="editFolder">Save</button>
        </div>
      </div>
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
  </div>
</template>
<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      apitoken: this.$store.state.apitoken,
      kolname: "",
      KOLnameList: [],
      foldername: "",
      folderList: [],
      folderNameList: [],
      platform: "",
      platformList: [],
      selected: [],
      selectAll: false,
      addfoldername: "",
      addfolderdescription: "",
      type: "",
      action: "",
      exportselect: [],
      columnsKollist,
      exportKolData: [],
      selectedRowKeys: [],
      selectedRows: [],
      selectedRowsbyColum: [],
      jobListFloder: "",
      checkedList: [],
      exportList: [
        { label: "KOL name", field: "kolname", id: 1 },
        { label: "Platform", field: "platform", id: 2 },
        { label: "Scope of work", field: "scope", id: 3 },
        { label: "Cost (THB)", field: "cost", id: 4 },
        { label: "Price (THB)", field: "price", id: 5 },
        { label: "Margin (%)", field: "margin", id: 6 },
        { label: "Remark", field: "remark", id: 7 },
        { label: "Timeline", field: "timeline", id: 8 }
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
    openPopup(id, action, name, desc, folderid) {
      // console.log(id, action, name, desc);
      $(".popup.folder").addClass("open");
      this.type = id;
      this.action = action;
      if (action == "add") {
        this.titletype = "Add new " + id;
      } else if (action == "edit") {
        this.titletype = "Edit " + id;

        this.addfoldername = name;
        this.addfolderdescription = desc;
        this.folderid = folderid;
      }
    },
    closePopup() {
      $(".popup").removeClass("open");
      this.name = "";
      this.type = "";
      this.action = "";
      this.addfoldername = "";
      this.addfolderdescription = "";
      this.folderid = "";
      $(".popup")
        .find(".require")
        .removeClass("require");

      this.checkedList = this.exportList;
    },
    onSelectChange(selectedRow) {
      this.selectedRowKeys = selectedRow;
      var profileid = [],
        jobid = [];

      selectedRow.forEach(function(item, index, arr) {
        item.split("#").forEach(function(item, index, arr) {
          if (index % 2 === 0) {
            profileid.push(item);
          } else {
            jobid.push(item);
          }
        });
      });

      var uniqjobid = jobid.reduce(function(a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);
      var jobListFloder = this.jobListFloder;

      function filterArray(array, filter) {
        return array.filter(function(a) {
          if (filter.indexOf(a.jobid) !== -1) {
            return a;
          }
        });
      }

      var jobListCheck = filterArray(jobListFloder, uniqjobid);
      this.getDataExport(jobListCheck);
    },
    getDataExport(jobListCheck) {
      const _selectedRows = jobListCheck.map(kol => ({
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

      // console.log(this.selectedRowsbyColum, this.selectedRows);
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
    exportSubmit() {
      if (this.checkedList == "") {
        alert("กรุณาเลือกข้อมูลที่ต้องการ");
      } else {
      }
    },
    onCheckExport(checkedValues) {
      this.groupDataBySelect();
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
              const folderNameList = data.folder.map(obj => {
                var _folderNameList = obj.foldername;
                return _folderNameList;
              });

              this.folderNameList = folderNameList;
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
        this.myFolderView();
      });
    },
    createFolder() {
      if (this.addfoldername == "") {
        $("#addfoldername").addClass("require");
      }
      if (this.addfolderdescription == "") {
        $("#addfolderdescription").addClass("require");
      }
      if ($(".popup#folder .require").length !== 0) {
        return;
      }
      this.myFolderAdd();
    },
    myFolderAdd() {
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
            //
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else if (data.detail == "FolderName_existing")
            alert("ชื่อ folder ซ้ำ");
          else alert(data.detail);
          this.myFolderView();
          this.closePopup();
          hideOverlay();
        });
    },
    editFolder() {
      if (this.addfoldername.replace(/\s/g, "") == "")
        $("#addfoldername").addClass("require");
      if (this.addfolderdescription.replace(/\s/g, "") == "")
        $("#addfolderdescription").addClass("require");
      if ($(".popup .require").length !== 0) {
        return;
      }

      const filter = {
        params: {
          apitoken: this.apitoken,
          workspaceid: this.folderid,
          foldername: this.addfoldername.replace(/\s/g, ""),
          description: this.addfolderdescription.replace(/\s/g, "")
        }
      };

      axios
        .get(`${this.$store.state.apiURL}myKOL/myFolderEdit.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            //
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else if (data.detail == "FolderName_existing")
            alert("ชื่อ folder ซ้ำ");
          else alert(data.detail);
          this.myFolderView();
          this.closePopup();
          hideOverlay();
        });
    },
    myFolderDelete(id) {
      const filter = {
        params: {
          apitoken: this.apitoken,
          workspaceid: id
        }
      };

      axios
        .get(`${this.$store.state.apiURL}myKOL/myFolderDelete.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            this.resetSelectRow();
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.myFolderView();
          this.closePopup();
          hideOverlay();
        });
    },
    myFolderView() {
      const filter = {
        params: {
          apitoken: this.apitoken,
          kolname: this.kolname,
          foldername: this.foldername,
          platformid: this.platform
        }
      };

      axios
        .get(`${this.$store.state.apiURL}myKOL/myFolderView.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            const kolview = data.folder.map(folder => ({
              folderid: folder.folderid,
              foldername: folder.foldername,
              description: folder.description,
              profile: folder.profile
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
                .reduce((l, n) => l.concat(n), [])
            }));

            const folderview = kolview.map(folder => ({
              folderid: folder.folderid,
              foldername: folder.foldername,
              description: folder.description,
              profile: folder.profile
                .map(value =>
                  value.job.map(child =>
                    Object.assign(
                      { jobid: child.jobid },
                      { profileid: value.profileid },
                      { kolname: value.kolname },
                      { kolpic: value.kolpic },
                      { platformid: value.platformid },
                      { kolplatformid: value.kolplatformid },
                      { url: value.url },
                      { param1: value.param1 },
                      { param1value: value.param1value },
                      { param2: value.param2 },
                      { param2value: value.param2value },
                      {
                        key:
                          folder.folderid +
                          "#" +
                          child.jobid +
                          "#" +
                          value.kolplatformid,
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
                .reduce((l, n) => l.concat(n), [])
            }));
            this.folderList = folderview;

            const jobList = folderview
              .map(folder =>
                folder.profile.map(child =>
                  Object.assign(
                    { jobid: child.jobid },
                    { kolname: child.kolname },
                    { platformid: child.platformid },
                    { cost: child.cost },
                    { creditterm: child.creditterm },
                    { discount: child.discount },
                    { email: child.email },
                    { jobid: child.jobid },
                    { jobno: child.jobno },
                    { lineid: child.lineid },
                    { mobile: child.mobile },
                    { price: child.price },
                    { product: child.product },
                    { ratecost: child.ratecost },
                    { remark: child.remark },
                    { salename: child.salename },
                    { scope: child.scope },
                    { workingtime: child.workingtime },
                    { margin: child.margin }
                  )
                )
              )
              .reduce((l, n) => l.concat(n), []);

            var resArr = [];
            jobList.forEach(function(item) {
              var i = resArr.findIndex(x => x.jobid == item.jobid);
              if (i <= -1) {
                resArr.push({
                  jobid: item.jobid,
                  kolname: item.kolname,
                  kolname: item.kolname,
                  platformid: item.platformid,
                  scope: item.scope,
                  cost: item.cost,
                  price: item.price,
                  remark: item.remark,
                  margin: item.margin,
                  workingtime: item.workingtime
                });
              }
            });
            this.jobListFloder = resArr;

            //
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.closePopup();
          hideOverlay();
        });
    },
    jobRemoveFromMyFolder() {
      if (this.selectedRows.length == 0) {
        alert("Select KOL");
        return;
      }
      const filter = {
        params: {
          apitoken: this.apitoken,
          delid: this.selectedRowKeys.join("|")
        }
      };

      axios
        .get(
          `${this.$store.state.apiURL}myKOL/jobRemoveFromMyFolder.aspx`,
          filter
        )
        .then(({ data }) => {
          if (data.result == "complete") {
            this.resetSelectRow();
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.myFolderView();
          this.closePopup();
          hideOverlay();
        });
    },
    openFolder(id) {
      $("#datainfolder li#floder_" + id).toggleClass("open");
    },
    onSelectFilterKolname(value) {
      this.kolname = value;
      this.myFolderView();
    },
    onSelectFilterFoldername(value) {
      this.foldername = value;
      this.myFolderView();
    },
    onFilter() {
      clearTimeout(typingTimer);
      window.typingTimer = setTimeout(
        function() {
          this.myFolderView();
        }.bind(this),
        doneTypingInterval
      );
    },
    checkIdPlatform(platformid) {
      const _platform = this.platformList.find(x => x.id === platformid);
      return _platform.title.toLowerCase();
    },
    handlerKeyup(event) {
      const _this = this;
      const id = event.target.id;
      $("#" + id).removeClass("require");
      // console.log(id);
    },
    SearchKolByPlatform() {
      this.myFolderView();
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
    addComma(value) {
      return (parseInt(value) + "").replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
  },
  mounted() {
    this.filterSetting();
    this.checkedList = this.exportList;
    this.exportSubmit();
  },
  computed: {
    rowSelection() {
      const { selectedRows } = this;
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
        }
      };
    }
  }
};
</script>