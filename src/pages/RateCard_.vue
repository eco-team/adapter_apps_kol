<template>
  <div id="ratecard">
    <div id="filter" class="box">
      <h4>KOL Rate Card</h4>
      <p class="desc">This is a description for KOL rate card</p>
      <a class="btn red addnew" @click="openPopup('addnewkol','add')">
        <span>+</span> Add a new KOL
      </a>
      <a-row :gutter="24">
        <a-col :span="5">
          <a-auto-complete
            :dataSource="jobnoList"
            v-model="jobno"
            placeholder="JobNo."
            :filterOption="filterOption"
          />
        </a-col>
        <a-col :span="6">
          <!-- <a-input id="kolname" v-model="kolname" placeholder="KOL name" /> -->
          <a-auto-complete
            :dataSource="kolnameList"
            v-model="kolname"
            placeholder="KOL name"
            :filterOption="filterOption"
          />
        </a-col>
        <a-col :span="11">
          <a-auto-complete
            :dataSource="categoryortagList"
            v-model="categoryortag"
            placeholder="Category or tag"
            :filterOption="filterOption"
          />
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="5">
          <a-select v-model="plattfrom">
            <a-select-option value>All platfrom</a-select-option>
            <a-select-option v-for="data in platformList" :key="data.id">{{data.title}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-auto-complete
            :dataSource="productList"
            v-model="product"
            placeholder="Product"
            :filterOption="filterOption"
          />
        </a-col>
        <a-col :span="4">
          <a-auto-complete
            :dataSource="suppliernameList"
            v-model="suppliername"
            placeholder="Supplier name"
            :filterOption="filterOption"
          />
        </a-col>
        <a-col :span="4">
          <a-select v-model="bydate">
            <a-select-option value>Date</a-select-option>
            <a-select-option v-for="data in bydateList" :key="data">{{data}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <button class="btn white reset" @click="resetFilter">Reset filters</button>
        </a-col>
      </a-row>
    </div>

    <div id="dataFilter">
      <div class="table-header">
        <div v-for="data in columnsKOLView" :key="data.key" :class="'td_'+data.class">{{data.title}}</div>
      </div>

      <ul class="collapse-table">
        <li
          v-for="(kol,index) in KOLView"
          :key="index"
          :id="'kol_'+index"
          :class="{ open: index==0,disabled : kol.profile==''}"
        >
          <div class="head">
            <div @click="openKol(index)" class="header-desc">
              <span class="icon right">
                <a-icon type="caret-right" />
              </span>
              <span class="icon down">
                <a-icon type="caret-down" />
              </span>
              <span class="kolpic">
                <img src="../assets/images/default.png" />
              </span>
              <span>{{kol.kolname}}</span>
            </div>
            <div class="action">
              <a @click="openPopup('addnewkol','edit',kol.profileid)">Edit</a>
              <a-popconfirm title="Are you sure delete?" @confirm="() => deleteKol(kol.profileid)">
                <a href="javascript:;">Delete</a>
              </a-popconfirm>
            </div>
          </div>
          <div class="detail">
            <ul class="collapse-table">
              <li
                v-for="(platform,index) in kol.platform"
                :key="index"
                :id="'platform_'+index"
                :class="{disabled : platform.platformid==''}"
              >
                <div class="head">
                  <div @click="openKolPlatform(index)" class="header-desc">
                    <span class="icon right">
                      <a-icon type="caret-right" />
                    </span>
                    <span class="icon down">
                      <a-icon type="caret-down" />
                    </span>
                    <!-- :class="platform.platformid | checkIdPlatform(platformList)" -->
                    <span
                      class="thumbnail-social"
                      :class="platform.platformid | checkIdPlatform(platformList)"
                    ></span>
                    <span>
                      <em>{{platform.param1}}</em>
                      <em>{{platform.param2value}}</em>
                    </span>
                    <span>
                      <em>{{platform.param2}}</em>
                      <em>{{platform.param2value}}</em>
                    </span>
                  </div>
                  <div class="action">
                    <a
                      @click="openPopup('addnewratecard','add', platform.platformid)"
                    >Add new rate card</a>
                  </div>
                </div>
                <div class="detail">
                  <a-table
                    :columns="innerJobs"
                    :dataSource="platform.job"
                    :pagination="false"
                    rowKey="jobid"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :scroll="{ x: 1800 }"
                  >
                    <span
                      slot="margin"
                      slot-scope="margin"
                      :class="margin | getClassMargin"
                    >{{margin}} %</span>

                    <span slot="action" slot-scope="job">
                      <a @click="openPopup('addnewratecard','edit', job.jobid)">Edit</a>
                      <a-popconfirm
                        title="Are you sure delete?"
                        @confirm="() => deleteJob(job.jobid)"
                      >
                        <a href="javascript:;">Delete</a>
                      </a-popconfirm>
                    </span>
                  </a-table>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <a-table
      id="tableKolContact"
      :columns="columnsKOLView"
      :dataSource="KOLView"
      :pagination="false"
      style="display:none"
    >
      <span slot="kolpic" slot-scope="kolpic" class="kolpic">
        <img src="../assets/images/default.png" />
      </span>

      <span slot="view" slot-scope="text">
        <a href="javascript:;">view</a>
      </span>

      <span slot="action" slot-scope="kol">
        <a @click="openPopup('addnewkol','edit',kol.profileid)">Edit</a>
        <!-- <a href="javascript:;" @click="deleteKol(kol.profileid)">Delete</a> -->
        <a-popconfirm title="Are you sure delete?" @confirm="() => deleteKol(kol.profileid)">
          <a href="javascript:;">Delete</a>
        </a-popconfirm>
      </span>

      <!-- <div slot="expandedRowRender" slot-scope="record" style="margin: 0">{{record.platform}}</div> -->
      <a-table
        slot="expandedRowRender"
        slot-scope="record"
        :columns="innerColumns"
        :dataSource="record.platform"
        :pagination="false"
        rowKey="platformid"
        class="tablebyplatform"
      >
        <span
          slot="platformid"
          slot-scope="platformid"
          class="thumbnail-social"
          :class="platformid | checkIdPlatform(platformList)"
        ></span>
        <span slot="action" slot-scope="platformid" class="action">
          <a @click="openPopup('addnewratecard','add', platformid)">Add new rate card</a>
        </span>
        <div slot="expandedRowRender" slot-scope="record" style="margin: 0" class="jobsTable">
          <a-table
            :columns="innerJobs"
            :dataSource="record.job"
            rowKey="jobid"
            :pagination="false"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :scroll="{ x: 1800 }"
          >
            <span slot="margin" slot-scope="margin" :class="margin | getClassMargin">{{margin}} %</span>

            <span slot="action" slot-scope="job">
              <a @click="openPopup('addnewratecard','edit', job.jobid)">Edit</a>
              <a-popconfirm title="Are you sure delete?" @confirm="() => deleteJob(job.jobid)">
                <a href="javascript:;">Delete</a>
              </a-popconfirm>
            </span>
          </a-table>
        </div>
      </a-table>

      <!-- <a-table
        slot="expandedRowRender"
        slot-scope="text"
        :columns="innerColumns"
        :dataSource="KOLView"
        :pagination="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
        <span slot="action" slot-scope="text" class="table-action">
          <a @click="openPopup('addnewratecard','add')">Add new rate card</a>
        </span>
      </a-table>-->
    </a-table>

    <div id="addnewkol" class="popup">
      <div :class="action">
        <h5>Add a new KOL</h5>
        <div class="form">
          <a-row :gutter="24">
            <a-col :span="6">
              <div class="thumbnail-profile" @click="browsefile">
                <div>
                  <img id="profile" src="../assets/images/blank.png" />
                  <i class="fa fa-user-circle-o"></i>
                  <input id="browsethumb" type="file" @change="previewFiles" />
                </div>
                <i class="fa fa-camera"></i>
              </div>
            </a-col>
            <a-col :span="18">
              <label>KOL name</label>
              <a-input id="addkolname" v-model="addkolname" placeholder />
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="4">
              <div class="thumbnail-url">
                <div></div>
              </div>
            </a-col>
            <a-col :span="20">
              <label>URL Link</label>
              <a-row :gutter="24">
                <a-col :span="17">
                  <a-input id="addurllink" v-model="addurllink" placeholder @change="checkUrl()" />
                </a-col>
                <a-col :span="7">
                  <div class="thumbnail-social" :id="urldomain"></div>
                  <i class="fa fa-trash-o" @click="deleteUrl"></i>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <a>Add other URL link</a>
            </a-col>
          </a-row>
          <a-row :gutter="24" class="category">
            <a-col :span="24">
              <div>
                <label>Category</label>
                <div>
                  <template v-for=" tag in categoryListItem">
                    <a-checkable-tag
                      :key="tag.id"
                      :checked="selectedTags.indexOf(tag.id) > -1"
                      @change="(checked) => handleChange(tag.id, checked)"
                    >{{tag.title}}</a-checkable-tag>
                  </template>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row :gutter="24" class="tags">
            <a-col :span="24">
              <label>Tags</label>
              <vue-tags-input
                v-model="tag"
                :tags="tags"
                :autocomplete-items="filteredItems"
                :placeholder="tagsplaceholder"
                :addOnKey="[9, 13, 32, 188]"
                @tags-changed="newTags => tags = newTags"
              />
            </a-col>
          </a-row>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancle</button>
          <button v-if="action == 'add'" class="btn red" @click="addNewKol()">Add</button>
          <button v-if="action == 'edit'" class="btn red" @click="editeKol()">Save</button>
        </div>
      </div>
    </div>

    <div id="addnewratecard" class="popup">
      <div>
        <h5>{{ titletype }} facebook Rate card : นี่หรือคนเมา</h5>
        <div class="form">
          <a-row :gutter="24">
            <a-col :span="12">
              <label>Job No.</label>
              <a-input id="addjobno" v-model="addjobno" placeholder />
            </a-col>
            <a-col :span="12">
              <label>Scope of work</label>
              <a-select v-model="addscope">
                <a-select-option value>Select scope</a-select-option>
                <a-select-option v-for="data in scopeList" :key="data.id">{{data.title}}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <label>Product</label>
              <a-input id="addproduct" v-model="addproduct" placeholder />
            </a-col>
            <a-col :span="12">
              <label>Supplier name</label>
              <a-select v-model="addsuppliername">
                <a-select-option value>Select name</a-select-option>
                <a-select-option
                  v-for="data in supplierList"
                  :key="data.contactid"
                >{{data.salename}}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <label>Timeline</label>
              <a-input id="addtimeline" v-model="addtimeline" placeholder />
            </a-col>
          </a-row>

          <div class="line"></div>

          <a-row :gutter="24">
            <a-col :span="12">
              <label>Rate card cost (THB):</label>
              <a-input id="addratecardcost" v-model="addratecardcost" placeholder />
            </a-col>
            <a-col :span="12">
              <label>Discount:</label>
              <a-input id="adddiscount" v-model="adddiscount" placeholder />
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <label>Cost (THB):</label>
              <a-input id="addcost" v-model="addcost" placeholder />
            </a-col>
            <a-col :span="12">
              <label>Price (THB):</label>
              <a-input id="addprice" v-model="addprice" placeholder />
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              {{marginFilter}}
              <label>Margin (%):</label>
              <a-input id="addmargin" v-model="addmargin" placeholder disabled />
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <label>Remark</label>
              <a-textarea id="addremark" v-model="addremark" placeholder />
            </a-col>
          </a-row>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancle</button>
          <button v-if="action == 'add'" class="btn red" @click="jobAdd()">Add</button>
          <button v-if="action == 'edit'" class="btn red" @click="jobEdit()">Save</button>
        </div>
      </div>
    </div>

    <div id="footer-page" class="text-right">
      <button class="btn red addnew" @click="jobAddToMyList">
        <span>+</span> Add to list
      </button>
      <button class="btn white view" @click="resetFilter">
        view KOL list
        <span>1</span>
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VueTagsInput from "@johmun/vue-tags-input";
const columnsKOLView = [
  {
    title: "",
    dataIndex: "kolpic",
    key: "kolpic",
    class: "kolpicprofile",
    width: 40,
    scopedSlots: { customRender: "kolpic" }
  },
  {
    title: "KOL name",
    dataIndex: "kolname",
    key: "kolname",
    class: "kolname",
    width: 180
  },
  {
    title: "Contact",
    class: "view",
    key: "view",
    scopedSlots: { customRender: "view" }
  },
  {
    title: "Action",
    class: "action",
    key: "profileid",
    scopedSlots: { customRender: "action" }
  }
];
const innerJobs = [
  {
    title: "Job No.",
    dataIndex: "jobno",
    key: "jobno",
    class: "jobno",
    fixed: "left"
  },
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
    class: "product",
    fixed: "left"
  },
  {
    title: "Scope of work",
    dataIndex: "scope",
    key: "scope",
    class: "scope",
    fixed: "left"
  },
  {
    title: "Supllier name",
    dataIndex: "salename",
    key: "salename",
    class: "salename",
    fixed: "left"
  },
  {
    title: "Rate card cost (THB)",
    dataIndex: "ratecost",
    key: "ratecost"
  },
  {
    title: "Discount (%)",
    dataIndex: "discount",
    key: "discount"
  },
  {
    title: "Cost (THB)",
    dataIndex: "cost",
    key: "cost"
  },
  {
    title: "Price (THB)",
    dataIndex: "price",
    key: "price"
  },
  {
    title: "Margin (%)",
    dataIndex: "margin",
    key: "margin",
    scopedSlots: { customRender: "margin" }
  },
  {
    title: "Remark",
    dataIndex: "remark",
    key: "remark",
    class: "remark"
  },
  {
    title: "Timeline",
    dataIndex: "workingtime",
    key: "workingtime",
    class: "timeline"
  },
  {
    title: "update date",
    dataIndex: "updatedate",
    key: "updatedate"
  },
  {
    title: "Action",
    class: "action",
    key: "jobid",
    scopedSlots: { customRender: "action" }
  }
];
const innerColumns = [
  {
    title: "Platform",
    dataIndex: "platformid",
    key: "platformid",
    scopedSlots: { customRender: "platformid" }
  },
  {
    title: "Action",
    dataIndex: "platformid",
    key: "action",
    class: "action",
    scopedSlots: { customRender: "action" }
  }
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    kolname: `นี่หรือคนเมา`,
    engagement: "55%",
    platform: `Facebook`
  });
}

export default {
  components: {
    VueTagsInput
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60
      },
      apitoken: this.$store.state.apitoken,
      type: "",
      action: "",
      jobno: "",
      kolname: "",
      categoryortag: "",
      plattfrom: "",
      product: "",
      suppliername: "",
      // platformList: ["Facebook", "Youtube", "Twitter", "Instragram", "Website"],
      platformList: "",
      bydate: "",
      addkolname: "",
      addurllink: "",
      urldomain: "",
      addcategory: [],
      categoryList: [],
      KOLView: [],

      data,
      columnsKOLView,
      innerColumns,
      innerJobs,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,

      jobnoList: ["00-0001", "00-0002", "00-0003"],
      kolnameList: ["นี่หรือคนเมา", "พี่เอ็ด7วิ", "EFM"],
      categoryortagList: [],
      categoryListItem: [],
      productList: ["Krungsri", "Oishi", "Est"],
      supplierList: [],
      suppliernameList: [],
      bydateList: ["1 วัน", "1 เดือน", "1 ปี"],
      addtags: "",

      selectedTags: [],

      tag: "",
      tags: [],
      tagsplaceholder: "",
      autocompleteItems: [],
      //Add new Rate card
      addjobno: "",
      addscope: "",
      addproduct: "",
      addsuppliername: "",
      addtimeline: "",
      addratecardcost: "",
      adddiscount: "",
      addcost: "",
      addprice: "",
      addmargin: "",
      addremark: "",
      scopeList: [],
      titletype: ""
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  methods: {
    openPopup(id, action, data) {
      // console.log(data);
      this.type = id;
      this.action = action;
      console.log(data);

      if (id == "addnewkol") {
        if (action == "add") {
          this.titletype = "Add new " + id;
          $(".popup#" + id).addClass("open");
        } else if (action == "edit") {
          this.titletype = "Edit " + id;
          this.name = data;
          this.getDataById(id, data);
        }
      } else {
        this.platformid = data;
        if (action == "add") {
          this.titletype = "Add new ";
          $(".popup#" + id).addClass("open");
        } else if (action == "edit") {
          this.titletype = "Edit ";
          this.name = data;
          this.jobid = data;

          this.getJobById(id, data);

          // $(".popup#" + id).addClass("open");
        }
      }
    },

    getJobById(id, data) {
      function findById(obj, id) {
        var result;
        for (var p in obj) {
          if (obj.jobid === id) {
            return obj;
          } else {
            if (typeof obj[p] === "object") {
              result = findById(obj[p], id);
              if (result) {
                return result;
              }
            }
          }
        }
        return result;
      }

      var result = findById(this.KOLView, data);
      const platform = this.scopeList.find(x => x.title === result.scope);
      const salename = this.supplierList.find(
        x => x.salename === result.salename
      );

      this.addscope = platform.id;
      this.addsuppliername = salename.contactid;
      this.addjobno = result.jobno;
      this.addproduct = result.product;
      this.addratecardcost = result.ratecost;
      this.adddiscount = result.discount;
      this.addcost = result.cost;
      this.addprice = result.price;
      this.addmargin = result.margin;
      this.addremark = result.remark;
      this.addtimeline = result.workingtime;

      $(".popup#" + id).addClass("open");
    },
    getDataById(id, data) {
      const tableDataSelect = this.KOLView.find(x => x.profileid === data);
      const category = tableDataSelect.category.map(data => {
        return data.categoryid;
      });

      const tags = tableDataSelect.tag.map(tag => ({
        text: tag.title
      }));
      this.addkolname = tableDataSelect.kolname;
      this.selectedTags = category;
      this.tags = tags;
      this.profileid = data;

      $(".popup#" + id).addClass("open");
    },
    closePopup() {
      $(".popup").removeClass("open");
      this.addkolname = "";
      this.selectedTags = [];
      this.tags = [];
      this.profileid = "";

      this.addscope = "";
      this.addsuppliername = "";
      this.addjobno = "";
      this.addproduct = "";
      this.addratecardcost = "";
      this.adddiscount = "";
      this.addcost = "";
      this.addprice = "";
      this.addmargin = "";
      this.addremark = "";
      this.addtimeline = "";
    },
    filterSetting() {
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
      const filtertag = {
        params: {
          apitoken: this.apitoken,
          itemtype: "tag"
        }
      };
      const filterSupplier = {
        params: {
          apitoken: this.apitoken,
          contacttype: "Supplier"
        }
      };
      Promise.all([
        axios
          .get(`${this.$store.state.apiURL}setting/itemView.aspx`, filter)
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") invalid_apitoken();
            else {
              const platformList = data.item.map(obj => {
                var _platformList = {};
                _platformList = obj.title;
                return _platformList;
              });
              this.platformList = data.item;

              // console.log(this.platformList);
            }
          }),
        axios
          .get(`${this.$store.state.apiURL}setting/itemView.aspx`, filterscope)
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") invalid_apitoken();
            else {
              const scopeList = data.item.map(scope => ({
                key: scope.id,
                id: scope.id,
                title: scope.title
              }));

              this.scopeList = scopeList;
              // console.log(supplierList);
            }
          }),
        axios
          .get(
            `${this.$store.state.apiURL}setting/itemView.aspx`,
            filtercategory
          )
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") invalid_apitoken();
            else {
              const categoryList = data.item.map(obj => {
                var _categoryList = {};
                _categoryList = obj.title;
                return _categoryList;
              });
              this.categoryList = categoryList;
              this.categoryortagList = categoryList;
              this.categoryListItem = data.item;

              console.log();
            }
          }),
        axios
          .get(`${this.$store.state.apiURL}setting/itemView.aspx`, filtertag)
          .then(({ data }) => {
            if (data.detail == "invalid_apitoken") invalid_apitoken();
            else {
              const _tags = data.item;
              const tags = _tags.map(item => ({
                text: item.title
              }));
              this.autocompleteItems = tags;
            }
          }),
        axios
          .get(
            `${this.$store.state.apiURL}contact/contactView.aspx`,
            filterSupplier
          )
          .then(({ data }) => {
            if (data.result == "complete") {
              const contactnameList = data.contact;

              const _contactnameList = contactnameList.map(contact => ({
                key: contact.contactid, // I added this line
                contactid: contact.contactid,
                salename: contact.salename,
                lineid: contact.lineid,
                mobile: contact.mobile,
                email: contact.email,
                type: contact.type,
                kollist: contact.kollist,
                creditterm: contact.creditterm
              }));

              this.supplierList = _contactnameList;
              // console.log(this.supplierList);

              const _suppliernameList = data.contact.map(obj => {
                var suppliername = {};
                suppliername = obj.salename;
                return suppliername;
              });

              this.suppliernameList = _suppliernameList;

              hideOverlay();
            } else if (data.detail == "invalid_apitoken")
              this.invalid_apitoken();
            else {
              alert(data.detail);
            }
          })
      ]).then(({ data }) => {
        hideOverlay();
      });
    },
    filterdata() {
      showOverlay();

      const filterKOLView = {
        params: {
          apitoken: this.apitoken
        }
      };

      axios
        .get(`${this.$store.state.apiURL}KOL/KOLView.aspx`, filterKOLView)
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") invalid_apitoken();
          else {
            const profile = data.profile;
            const _KOLView = profile.map(profile => ({
              key: profile.profileid,
              profileid: profile.profileid,
              kolname: profile.kolname,
              kolpic: profile.kolpic,
              platform: profile.platform,
              // platform: profile.profileid,
              category: profile.category,
              tag: profile.tag
            }));

            this.KOLView = _KOLView;
            console.log(_KOLView);

            //
          }

          hideOverlay();
        });
    },
    resetFilter() {
      this.jobno = "";
      this.kolname = "";
      this.categoryortag = "";
      this.plattfrom = "";
      this.product = "";
      this.suppliername = "";
      this.bydate = "";
    },
    selectCategory: function(e) {
      let category = e.target.textContent;
      let classTarget = $(e.target).attr("class");
      if (classTarget == undefined || classTarget == "") {
        $(e.target).attr("class", "select");
      } else {
        $(e.target).attr("class", "");
      }
    },
    start() {
      this.loading = true;
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    browsefile() {
      $("#browsethumb").trigger("click");
    },
    deleteUrl() {
      this.addurllink = "";
    },
    previewFiles(event) {
      var file = event.target.files[0];
      if (file == undefined) {
        this.files = event.target.files[0];
      } else {
        var output = document.getElementById("profile");
        output.src = URL.createObjectURL(file);
      }
    },
    checkUrl() {
      this.getUrlParts(this.addurllink);
    },
    getUrlParts() {
      if (this.addurllink == "") {
        console.log("-");
      } else if (this.addurllink.indexOf("://") == -1) {
        alert("URL Link ไม่ถูกต้อง");
      } else {
        var host = new URL(this.addurllink).hostname.split(".");
        var hostnamelength = host.length;
        var domain = host[hostnamelength - 2];
        console.log(domain);
        if (
          domain == "facebook" ||
          domain == "youtube" ||
          domain == "twitter" ||
          domain == "instagram"
        ) {
          this.urldomain = domain;
        } else {
          this.urldomain = "website";
        }
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    handleChange(tag, checked) {
      console.log(this.selectedTags);
      const { selectedTags } = this;
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter(t => t !== tag);
      console.log("You are interested in: ", nextSelectedTags);
      this.selectedTags = nextSelectedTags;
    },
    addNewKol() {
      const _tags = this.tags;
      const tags = _tags.map(val => {
        return val.text;
      });

      const filter = {
        params: {
          apitoken: this.apitoken,
          kolname: this.addkolname,
          platformid: "650E45F6-4662-4486-B670-B801D5904FB8",
          platformurl: this.addurllink,
          categoryid: this.selectedTags.join("|"),
          tag: tags.join("|")
        }
      };

      axios
        .get(`${this.$store.state.apiURL}KOL/KOLAdd.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            alert("complete");
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);

          this.closePopup();
          this.filterdata();
        });
    },
    editeKol() {
      const _tags = this.tags;
      const tags = _tags.map(val => {
        return val.text;
      });

      const filter = {
        params: {
          apitoken: this.apitoken,
          profileid: this.profileid,
          kolname: this.addkolname,
          platformid:
            "650E45F6-4662-4486-B670-B801D5904FB8|AF99BFB6-DAB7-4736-AD72-0E63B94A2647",
          platformurl:
            this.addurllink +
            "|https://www.instagram.com/junjira_rattanarangsi/",
          categoryid: this.selectedTags.join("|"),
          tag: tags.join("|"),
          platformparam1: "Engagement|No. fans",
          platformparam2: "Engagement|Follower",
          platformparam1value: "55%|45%",
          platformparam2value: "55K|9.5M"
        }
      };

      console.log(filter);

      // return;

      axios
        .get(`${this.$store.state.apiURL}KOL/KOLEdit.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            alert("complete");
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);

          this.closePopup();
          this.filterdata();
        });
    },

    deleteKol(profileid) {
      showOverlay();

      const filter = {
        params: {
          apitoken: this.apitoken,
          profileid: profileid
        }
      };

      axios
        .get(`${this.$store.state.apiURL}KOL/KOLDelete.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            alert("complete");
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.closePopup();
          this.filterdata();
        });
    },

    jobAdd() {
      showOverlay();
      const filter = {
        params: {
          // addjobno  addscope addproduct addsuppliername addtimeline addratecardcost adddiscount addcost addprice addmargin addremark
          apitoken: this.apitoken,
          profileid: "DD2145F6-A913-4F03-B653-9BBF3B478C1E", //this.profileid,
          platformid: this.platformid, //this.platformid,
          scopeid: this.addscope, //this.addscope,
          contactid: this.addsuppliername,
          jobno: this.addjobno,
          product: this.addproduct,
          ratecost: this.addratecardcost,
          discount: this.adddiscount,
          cost: this.addcost,
          price: this.addprice,
          margin: this.addmargin,
          remark: this.addremark,
          workingtime: this.addtimeline
        }
      };

      console.log(filter);

      // return;

      axios
        .get(`${this.$store.state.apiURL}/job/jobAdd.aspx`, filter)
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else if (data.result == "complete") {
            //
          } else {
            alert(data.detail);
          }
          this.closePopup();
          this.filterdata();
        });

      hideOverlay();
    },
    jobEdit() {
      showOverlay();
      const filter = {
        params: {
          // addjobno  addscope addproduct addsuppliername addtimeline addratecardcost adddiscount addcost addprice addmargin addremark
          apitoken: this.apitoken,
          jobid: this.jobid,
          scopeid: this.addscope,
          contactid: this.addsuppliername,
          jobno: this.addjobno,
          product: this.addproduct,
          ratecost: this.addratecardcost,
          discount: this.adddiscount,
          cost: this.addcost,
          price: this.addprice,
          margin: this.addmargin,
          remark: this.addremark,
          workingtime: this.addtimeline
        }
      };

      axios
        .get(`${this.$store.state.apiURL}/job/jobEdit.aspx`, filter)
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else if (data.result == "complete") {
            //
          } else {
            alert(data.detail);
          }
          this.closePopup();
          this.filterdata();
        });

      hideOverlay();
    },
    deleteJob(jobid) {
      showOverlay();

      const filter = {
        params: {
          apitoken: this.apitoken,
          jobid: jobid
        }
      };

      axios
        .get(`${this.$store.state.apiURL}job/jobDelete.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            alert("complete");
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.closePopup();
          this.filterdata();
          hideOverlay();
        });
    },
    getScopeId(id) {
      // this.platformList
      const platform = this.scopeList.find(x => x.id === item_id);
      return platform;
    },
    jobAddToMyList() {
      //myKOL/jobAddToMyList.aspx

      const jobSelect = this.selectedRowKeys.join("|");
      console.log(jobSelect);

      showOverlay();

      const filter = {
        params: {
          apitoken: this.apitoken,
          jobid: jobSelect
        }
      };
      console.log(filter);

      axios
        .get(`${this.$store.state.apiURL}myKOL/jobAddToMyList.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            alert("complete");
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.closePopup();
          this.filterdata();
          hideOverlay();
        });
    },
    openKol(id) {
      $(".collapse-table > li#kol_" + id).toggleClass("open");
    },
    openKolPlatform(id) {
      $(".collapse-table > li#platform_" + id).toggleClass("open");
    }
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
    marginFilter() {
      var result = ((this.addprice - this.addcost) / this.addprice) * 100;

      if (this.addprice !== "" && this.addcost !== "") {
        this.addmargin = result.toFixed();
      } else {
        this.addmargin = "";
      }
    }
  },
  filters: {
    checkIdPlatform(platformid, platformList) {
      const _platform = platformList.find(x => x.id === platformid);
      console.log(_platform.title);
      return _platform.title.toLowerCase();
    },
    getClassMargin(margin) {
      if (margin < 37) {
        return "red";
      } else return "";
    }
  },
  mounted() {
    this.filterSetting();
    this.filterdata();
    // this.getParent(this.KOLView, "235DA228-414C-4683-80A5-4565C75F5B5A");
  }
};
</script>
