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
          <a-input id="jobno" v-model="jobno" placeholder="JobNo." @change="SearchByFilter()" />
        </a-col>
        <a-col :span="6">
          <a-auto-complete
            :dataSource="KOLnameList"
            v-model="kolname"
            placeholder="KOL name"
            maxlength="50"
            :filterOption="filterOption"
            @change="SearchByFilter()"
          />
        </a-col>
        <a-col :span="11">
          <a-auto-complete
            :dataSource="categorytagList"
            v-model="categorytag"
            placeholder="Category or tag"
            :filterOption="filterOption"
            @change="SearchByFilter()"
          />
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="5">
          <a-select v-model="platform" @change="SearchByFilter">
            <a-select-option value>All platfrom</a-select-option>
            <a-select-option
              v-for="data in platformList"
              :key="data.platformid"
              :value="data.id"
            >{{data.title}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-auto-complete
            :dataSource="productList"
            v-model="product"
            placeholder="Product"
            :filterOption="filterOption"
            @change="SearchByFilter()"
          />
        </a-col>
        <a-col :span="8">
          <a-auto-complete
            :dataSource="suppliernameList"
            v-model="suppliername"
            placeholder="Supplier name"
            :filterOption="filterOption"
            @change="SearchByFilter()"
          />
        </a-col>
        <a-col :span="4">
          <button class="btn white reset" @click="resetFilter">Reset filters</button>
        </a-col>
      </a-row>
    </div>
    <div v-if="KOLView.length==0" class="notdata">Not Found</div>
    <div id="dataFilter" v-if="KOLView.length!==0">
      <div class="table-header">
        <div v-for="data in columnsKOLView" :key="data.key" :class="'td_'+data.class">{{data.title}}</div>
      </div>

      <ul class="collapse-table">
        <li
          v-for="(kol,index) in KOLView"
          :key="kol.profileid"
          :id="'kol_'+kol.profileid"
          :class="{ open: index==0,disabled : kol.profile==''}"
        >
          <div class="head">
            <div class="header-desc">
              <span class="icon right" @click="openKol(kol.profileid)">
                <a-icon type="caret-right" />
              </span>
              <span class="icon down" @click="openKol(kol.profileid)">
                <a-icon type="caret-down" />
              </span>
              <span class="kolpic">
                <img src="../assets/images/default.png" v-if="kol.kolpic == ''" />
                <img :src="kol.kolpic" />
              </span>
              <span class="kolname">{{kol.kolname}}</span>
              <span class="view" @click="openPopup('contactbykolview',kol.profileid)">view</span>
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
                :key="platform.platformid+index"
                :id="'platform_'+platform.platformid+kol.profileid"
                :class="{disabled : platform.job==''}"
              >
                <div class="head">
                  <div class="header-desc">
                    <span
                      class="icon right"
                      @click="openKolPlatform(platform.platformid+kol.profileid)"
                    >
                      <a-icon type="caret-right" />
                    </span>
                    <span
                      class="icon down"
                      @click="openKolPlatform(platform.platformid+kol.profileid)"
                    >
                      <a-icon type="caret-down" />
                    </span>
                    <span class="url">
                      <a :href="platform.url" target="_blank">
                        <span
                          class="thumbnail-social"
                          :class="platform.platformid | checkIdPlatform(platformList)"
                        ></span>
                        <span class="name">{{platform.title}}</span>
                      </a>
                    </span>
                    <span class="param" v-if="platform.param2value !== ''">
                      <strong>{{platform.param1}}</strong>
                      <em>{{platform.param2value}}</em>
                    </span>
                    <span class="param" v-if="platform.param2value !== ''">
                      <strong>{{platform.param2}}</strong>
                      <em>{{platform.param2value}}</em>
                    </span>
                  </div>
                  <div class="action addnew">
                    <a
                      @click="openPopup('addnewratecard','add', platform.profileid, platform.platformid,platform.kolplatformid)"
                    >Add new rate card</a>
                  </div>
                </div>
                <div class="detail">
                  <a-table
                    id="koltableRateCard"
                    :columns="innerJobs"
                    :dataSource="platform.job"
                    :pagination="false"
                    rowKey="jobid"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :scroll="{ x: 2000 }"
                  >
                    <span slot="ratecost" slot-scope="ratecost">{{ratecost | addComma}}</span>
                    <span slot="discount" slot-scope="discount">{{discount | addComma}} %</span>
                    <span slot="cost" slot-scope="cost">{{cost | addComma}}</span>
                    <span slot="price" slot-scope="price">{{price | addComma}}</span>
                    <span
                      slot="margin"
                      slot-scope="margin"
                      :class="margin | getClassMargin"
                    >{{margin}} %</span>
                    <span slot="remark" slot-scope="remark">
                      <span :alt="remark">{{remark}}</span>
                    </span>
                    <span slot="lastupdate" slot-scope="lastupdate">{{lastupdate | getDateFormat}}</span>

                    <span slot="action" slot-scope="job">
                      <a
                        @click="openPopup('addnewratecard','edit', platform.profileid, platform.platformid,platform.kolplatformid, job.jobid)"
                      >Edit</a>
                      <a-popconfirm
                        title="Are you sure delete?"
                        @confirm="() => deleteJob(job.jobid,platform.kolplatformid)"
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
    <div id="addnewkol" class="popup">
      <div :class="action">
        <h5 v-if="action=='add'">Add new KOL</h5>
        <h5 v-if="action=='edit'">Edit KOL</h5>
        <div class="form">
          <a-form>
            <a-form-item class="kolname">
              <a-row :gutter="23">
                <a-col :span="5">
                  <div class="thumbnail-profile" @click="browsefile">
                    <div>
                      <img id="profile" src="../assets/images/blank.png" />
                      <i class="fa fa-user-circle-o"></i>
                      <input id="browsethumb" type="file" @change="previewFiles" />
                    </div>
                    <i class="fa fa-camera"></i>
                  </div>
                </a-col>
                <a-col :span="19">
                  <label>KOL name</label>
                  <a-input
                    id="addkolname"
                    v-model="addkolname"
                    placeholder
                    maxlength="50"
                    @keyup="handlerKeyup"
                  />
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item class="url-wrapper">
              <!-- {{urlList}} -->
              <a-row :gutter="23">
                <a-col :span="8">
                  <label>Name</label>
                </a-col>
                <a-col :span="12">
                  <label>URL link</label>
                </a-col>
              </a-row>
              <a-row
                :gutter="23"
                v-for="(item,index) in urlList"
                :key="index"
                :id="index"
                :class="{active:item.status==true, error:item.status==false}"
              >
                <a-col :span="24">
                  <a-row :gutter="24">
                    <a-col :span="8">
                      <a-input
                        v-model="item.title"
                        maxlength="50"
                        placeholder="ExampleAdapter"
                        :class="{require:item.title ==='' && item.status===false || item.status=='repeat'&&item.title ===''}"
                        @keyup="handlerUrlKeyup"
                      />
                    </a-col>
                    <a-col :span="12">
                      <a-input
                        v-model="item.url"
                        @change="checkUrl(item.url, index)"
                        placeholder="https://www.facebook.com/example"
                        class="inputurl"
                        maxlength="100"
                        :class="{require:item.status==false && item.platformid=='' ||item.status=='repeat'}"
                        @keyup="handlerUrlKeyup"
                      />
                    </a-col>
                    <a-col :span="2" class="action-icon">
                      <div class="thumbnail-social" :class="item.platformtitle"></div>
                    </a-col>
                    <a-col :span="2" class="action-icon">
                      <i
                        class="fa fa-trash-o dynamic-delete-button"
                        @click="() => remove(index)"
                        :disabled="urlList.length === 1"
                      ></i>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a @click="addItem" class="bt-addurl">
                <a-icon type="plus" />Add other URL link
              </a>
              <br />
            </a-form-item>
            <a-form-item>
              <a-row :gutter="24" class="category" id="categoryListItem">
                <a-col :span="24">
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
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="24" class="tags">
                <a-col :span="24">
                  <label>Tags</label>
                  <vue-tags-input
                    v-model="tag"
                    :tags="tags"
                    :autocomplete-items="filteredItems"
                    :placeholder="tagsplaceholder"
                    :addOnKey="[9, 13, 32]"
                    @tags-changed="newTags => tags = newTags"
                  />
                </a-col>
              </a-row>
            </a-form-item>

            <div class="text-right">
              <button class="btn red cancel" @click="closePopup()">Cancel</button>
              <button v-if="action == 'add'" class="btn red" @click="addNewKol()">Add</button>
              <button v-if="action == 'edit'" class="btn red" @click="editeKol()">Save</button>
            </div>
          </a-form>
        </div>
      </div>
    </div>

    <div id="addnewratecard" class="popup">
      <div :class="action">
        <h5 v-if="action=='add'">Add new {{platformname}} Rate card : {{kolname}}</h5>
        <h5 v-if="action=='edit'">Edit {{platformname}} Rate card : {{kolname}}</h5>
        <div class="form">
          <a-row :gutter="24">
            <a-col :span="12">
              <label>Job No.</label>
              <a-input
                id="addjobno"
                v-model="addjobno"
                placeholder
                maxlength="50"
                @keyup="handlerKeyup"
              />
            </a-col>
            <a-col :span="12">
              <label>Scope of work</label>
              <a-select v-model="addscope" id="addscope">
                <a-select-option value>Select scope</a-select-option>
                <a-select-option
                  v-for="data in scopeList"
                  :key="data.id"
                  :value="data.id"
                >{{data.title}}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <label>Product</label>
              <a-input
                id="addproduct"
                v-model="addproduct"
                placeholder
                maxlength="50"
                @keyup="handlerKeyup"
              />
            </a-col>
            <a-col :span="12">
              <label>Supplier name</label>
              <a-select v-model="addsuppliername" id="addsuppliername">
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
              <a-input
                id="addtimeline"
                v-model="addtimeline"
                placeholder
                maxlength="50"
                @keyup="handlerKeyup"
              />
            </a-col>
          </a-row>

          <div class="line"></div>

          <a-row :gutter="24">
            <a-col :span="12">
              <label>Rate card cost (THB):</label>
              <a-input
                id="addratecardcost"
                v-model="addratecardcost"
                placeholder
                maxlength="12"
                @keypress="ignoreChar"
                @keyup="handlerKeyup"
              />
            </a-col>
            <a-col :span="12">
              <label>Discount (%):</label>
              <a-input
                id="adddiscount"
                v-model="adddiscount"
                placeholder
                maxlength="12"
                @keypress="ignoreChar"
                @keyup="handlerKeyup"
              />
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <label>Cost (THB):</label>
              <a-input
                id="addcost"
                v-model="addcost"
                placeholder
                maxlength="10"
                @keypress="ignoreChar"
                @keyup="handlerKeyup"
              />
            </a-col>
            <a-col :span="12">
              <label>Price (THB):</label>
              <a-input
                id="addprice"
                v-model="addprice"
                placeholder
                maxlength="10"
                @keypress="ignoreChar"
                @keyup="handlerKeyup"
              />
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
              <a-textarea id="addremark" v-model="addremark" placeholder maxlength="50" />
            </a-col>
          </a-row>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancel</button>
          <button v-if="action == 'add'" class="btn red" @click="jobAdd()">Add</button>
          <button v-if="action == 'edit'" class="btn red" @click="jobEdit()">Save</button>
        </div>
      </div>
    </div>

    <div id="contactbykolview" class="popup" v-if="contactViewByKOLOpen==true">
      <div>
        <h5>KOL name: {{contactbykolList.kolname}}</h5>
        <div class="bt">
          <button class="btn red cancel" @click="closePopup()">Close</button>
          <button
            class="btn red addnew"
            @click="openPopup('contactbykol','add', profileid, kolname)"
          >
            <span>+</span> Add contact
          </button>
        </div>
        <div
          v-if="contactbykolList.contactsales==''&& contactbykolList.contactsupplier==''"
          class="notdata"
        >
          Not Found
          <br />
          <br />
        </div>
        <div v-if="contactbykolList.contactsales!=='' && contactbykolList.contactsupplier!==''">
          <a-table
            :columns="columsale"
            :dataSource="contactbykolList.contactsales"
            rowKey="contactid"
            :pagination="false"
          >
            <div slot="action" slot-scope="contactid" :class="{opacity:contactid == ''}">
              <a-popconfirm
                title="Are you sure delete?"
                @confirm="contactRemoveFromKOL(contactid)"
                cancelText="No"
                okText="Yes"
              >
                <a>Delete</a>
              </a-popconfirm>
            </div>
          </a-table>
          <a-table
            :columns="columsupplier"
            :dataSource="contactbykolList.contactsupplier"
            rowKey="contactid"
            :pagination="false"
          >
            <div slot="action" slot-scope="contactid" :class="{opacity:contactid == ''}">
              <a-popconfirm
                title="Are you sure delete?"
                @confirm="contactRemoveFromKOL(contactid)"
                cancelText="No"
                okText="Yes"
              >
                <a>Delete</a>
              </a-popconfirm>
            </div>
          </a-table>
        </div>
      </div>
    </div>

    <contactAddToKOL
      v-if="profileidcontact !== ''"
      :id="type"
      :contacttype="contacttype"
      :kolsaleList="kolsaleList"
      :contactnameList="supplierList"
      :profileid="profileid"
      :kolname="kolname"
      v-on:closePopup="closeContact"
      v-on:filterdata="contactViewByKOL('contactbykol', profileid)"
      class="open"
    ></contactAddToKOL>

    <div id="footer-page" class="text-right">
      <button
        class="btn red addnew"
        @click="jobAddToMyList"
        v-bind:class="{ disabled : this.selectedRowKeys.length ==0 }"
      >
        <span>+</span> Add to list
      </button>
      <router-link to="/KOLlist" tag="a" class="btn white view">
        view KOL list
        <span v-if="mykolcount>=1">{{mykolcount}}</span>
      </router-link>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import VueTagsInput from "@johmun/vue-tags-input";
import contactAddToKOL from "../components/contactAddToKOL.vue";

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
    fixed: "left",
    filterMultiple: false,
    onFilter: (value, record) => record.jobno.indexOf(value) === 0,
    sorter: (a, b) => a.jobno.length - b.jobno.length,
    sortDirections: ["descend", "ascend"]
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
    title: "Supplier name",
    dataIndex: "salename",
    key: "salename",
    class: "salename",
    fixed: "left"
  },
  {
    title: "Rate card cost (THB)",
    dataIndex: "ratecost",
    key: "ratecost",
    scopedSlots: { customRender: "ratecost" }
  },
  {
    title: "Discount (%)",
    dataIndex: "discount",
    key: "discount",
    scopedSlots: { customRender: "discount" }
  },
  {
    title: "Cost (THB)",
    dataIndex: "cost",
    key: "cost",
    scopedSlots: { customRender: "cost" },
    class: "cost"
  },
  {
    title: "Price (THB)",
    dataIndex: "price",
    key: "price",
    scopedSlots: { customRender: "price" }
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
    class: "remark",
    scopedSlots: { customRender: "remark" }
  },
  {
    title: "Timeline",
    dataIndex: "workingtime",
    key: "workingtime",
    class: "timeline"
  },

  {
    title: "Update date",
    dataIndex: "lastupdate",
    key: "lastupdate",
    scopedSlots: { customRender: "lastupdate" }
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

let id = 0;

export default {
  components: {
    VueTagsInput,
    contactAddToKOL
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
      categorytag: "",
      platform: "",
      product: "",
      suppliername: "",
      platformList: "",
      bydate: "",
      addkolname: "",
      addurllink: "",
      urldomain: "",
      addcategory: [],
      categoryList: [],
      KOLView: [],
      columnsKOLView,
      columsale,
      columsupplier,
      innerColumns,
      innerJobs,
      selectedRowKeys: [],
      loading: false,

      jobnoList: [],
      KOLnameList: [],
      categorytagList: [],
      categoryListItem: [],
      productList: [],
      supplierList: [],
      suppliernameList: [],
      bydateList: ["1 วัน", "1 เดือน", "1 ปี"],
      addtags: "",

      selectedTags: [],

      tag: "",
      tags: [],
      tagsplaceholder: "",
      autocompleteItems: [],
      tagsList: "",
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
      platformtitle: "",
      platformname: "",
      scopeList: [],
      titletype: "",
      groupCode: [],
      urlList: [
        {
          url: "",
          platformid: "",
          platformtitle: "",
          kolplatformid: "",
          title: "",
          status: true,
          platformparam1: "",
          platformparam2: ""
        }
      ],
      contactbykol: "",
      contactbykolList: "",

      contactViewByKOLOpen: false,

      profileid: "",
      salenameList: "",
      contacttype: "KOL Sale",
      saleadd: "",
      supplieradd: "",
      profileidcontact: "",
      kolsaleList: "",
      contactnameList: "",
      kolplatformid: "",
      mykolcount: localStorage.mykolcount
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "dynamic_form_item" });
    this.form.getFieldDecorator("keys", { initialValue: [], preserve: true });
  },
  methods: {
    remove(index) {
      if (this.urlList.length <= 1) {
        return;
      } else {
        var urllist = this.urlList;

        for (var i = urllist.length - 1; i >= 0; i--) {
          if (i === index) {
            urllist.splice(index, 1);
          }
        }

        this.urllist = this.urlList;
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.action == "add") {
            this.addNewKol();
          } else if (this.action == "edit") {
            this.editeKol();
          }
        }
      });
    },
    openPopup(id, action, data, data2, data3, data4) {
      this.action = action;
      $("body").addClass("hide");

      if (id == "addnewkol") {
        this.type = id;
        if (action == "add") {
          this.titletype = "Add new " + id;
          $(".popup#" + id).addClass("open");
        } else if (action == "edit") {
          this.titletype = "Edit " + id;
          this.name = data;
          this.getDataById(id, data);
          $("#profile").show();
        }
      } else if (id == "addnewratecard") {
        this.type = id;

        this.profileid = data;
        this.platformid = data2;
        this.kolplatformid = data3;

        if (action == "add") {
          this.kolname = this.checkProfilename(data);
          this.platformname = this.checkIdPlatform(data2);

          $(".popup#" + id).addClass("open");
        } else if (action == "edit") {
          // @click="openPopup('addnewratecard','edit', platform.profileid, platform.platformid,platform.kolplatformid, job.jobid)"
          this.titletype = "Edit ";
          this.name = data;
          this.jobid = data4;

          this.getJobById(id, data4);
        }
      } else if (id == "contactbykolview") {
        showOverlay();
        this.contactViewByKOLOpen = true;
        this.contactViewByKOL(id, action);
      } else if (id == "contactbykol") {
        this.profileidcontact = data;
        $(".popup#" + id).addClass("open");
        $("#contactbykolview").removeClass("open");
      }
    },

    getJobById(id, data) {
      var result = findById(this.KOLView, data);
      const scope = this.scopeList.find(x => x.title === result.scope);
      const salename = this.supplierList.find(
        x => x.salename === result.salename
      );

      this.addscope = scope.id;
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
      this.platformtitle = result.title;
      this.platformname = this.checkIdPlatform(result.platformid);
      this.kolname = result.kolname;
      this.profileidcontact = "";

      $(".popup#" + id).addClass("open");
    },
    getDataById(id, data) {
      const tableDataSelect = this.KOLView.find(x => x.profileid === data);
      const category = tableDataSelect.category.map(data => {
        return data.categoryid;
      });

      var urlList = tableDataSelect.platform.map(data => ({
        url: data.url,
        platformid: data.platformid,
        platformtitle: this.checkIdPlatform(data.platformid),
        title: data.title,
        kolplatformid: data.kolplatformid,
        status: true,
        platformparam1: data.param1,
        platformparam2: data.param2
      }));
      this.urlList = urlList;

      const tags = tableDataSelect.tag.map(tag => ({
        text: tag.title
      }));
      this.addkolname = tableDataSelect.kolname;
      this.selectedTags = category;
      this.tags = tags;
      this.profileid = data;
      var output = document.getElementById("profile");
      output.src = tableDataSelect.kolpic;

      $(".popup#" + id).addClass("open");
    },
    closePopup() {
      $(".popup").removeClass("open");
      $(".require").removeClass("require");
      $("body").removeClass("hide");

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
      this.platformtitle = "";
      this.kolname = "";
      this.kolplatformid = "";

      //contact
      this.contactbykolList = "";
      this.contactViewByKOLOpen = false;

      $("#profile")
        .hide()
        .attr("src", "");

      this.urlList = [
        {
          url: "",
          platformid: "",
          platformtitle: "",
          kolplatformid: "",
          title: "",
          status: true,
          platformparam1: "",
          platformparam2: ""
        }
      ];
    },
    closeContact() {
      this.profileidcontact = "";
      $("#contactbykolview").addClass("open");
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
      const filterSale = {
        params: {
          apitoken: this.apitoken,
          contacttype: "KOL Sale"
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
              this.categoryListItem = data.item;
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

              const tagsList = data.item.map(obj => {
                return obj.title;
              });
              this.tagsList = tagsList;
            }
          }),
        axios
          .get(
            `${this.$store.state.apiURL}contact/contactView.aspx`,
            filterSale
          )
          .then(({ data }) => {
            if (data.result == "complete") {
              const kolsaleList = data.contact;

              const _kolsaleList = kolsaleList.map(contact => ({
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

              this.kolsaleList = _kolsaleList;

              hideOverlay();
            } else if (data.detail == "invalid_apitoken")
              this.invalid_apitoken();
            else {
              alert(data.detail);
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
        var category = Object.values(this.categoryList);
        var tagsList = Object.values(this.tagsList);
        var categorytagList = category.concat(tagsList);
        this.categorytagList = categorytagList;

        this.filterdata();
      });
    },
    filterdata() {
      showOverlay();

      const filterKOLView = {
        params: {
          apitoken: this.apitoken,
          jobno: this.jobno,
          kolname: this.kolname,
          categorytag: this.categorytag,
          product: this.product,
          platformid: this.platform,
          salename: this.suppliername
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
              category: profile.category,
              tag: profile.tag
            }));

            const kolview = data.profile.map(profile => ({
              profileid: profile.profileid,
              kolpic: profile.kolpic,
              kolname: profile.kolname,
              category: profile.category,
              tag: profile.tag,
              platform: profile.platform.map(platform => ({
                kolplatformid: platform.kolplatformid,
                profileid: profile.profileid,
                param1: platform.param1,
                param1value: platform.param1value,
                param2: platform.param2,
                param2value: platform.param2value,
                platformid: platform.platformid,
                title: platform.title,
                url: platform.url,
                job: platform.job.map(job => ({
                  key: job.jobid,
                  profileid: profile.profileid,
                  platformid: platform.platformid,
                  title: platform.title,
                  kolname: profile.kolname,
                  cost: job.cost,
                  creditterm: job.creditterm,
                  discount: job.discount,
                  email: job.email,
                  jobid: job.jobid,
                  jobno: job.jobno,
                  lineid: job.lineid,
                  mobile: job.mobile,
                  price: job.price,
                  product: job.product,
                  ratecost: job.ratecost,
                  remark: job.remark,
                  salename: job.salename,
                  scope: job.scope,
                  workingtime: job.workingtime,
                  margin: job.margin,
                  lastupdate: job.lastupdate
                }))
              }))
            }));

            this.KOLView = Object.values(kolview);

            // kolnameList
            const _KOLnameList = data.profile.map(obj => {
              return obj.kolname;
            });
            this.KOLnameList = _KOLnameList;
          }

          hideOverlay();
        });
    },
    filterdataByFilter() {
      const filterKOLView = {
        params: {
          apitoken: this.apitoken,
          jobno: this.jobno,
          kolname: this.kolname,
          categorytag: this.categorytag,
          product: this.product,
          platformid: this.platform,
          salename: this.suppliername
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

            // this.KOLView = _KOLView;
            // console.log(_KOLView);

            const kolview = data.profile.map(profile => ({
              profileid: profile.profileid,
              kolpic: profile.kolpic,
              kolname: profile.kolname,
              category: profile.category,
              tag: profile.tag,
              platform: profile.platform.map(platform => ({
                profileid: profile.profileid,
                kolplatformid: platform.kolplatformid,
                param1: platform.param1,
                param1value: platform.param1value,
                param2: platform.param2,
                param2value: platform.param2value,
                platformid: platform.platformid,
                title: platform.title,
                url: platform.url,
                job: platform.job.map(job => ({
                  key: job.jobid,
                  profileid: profile.profileid,
                  platformid: platform.platformid,
                  title: platform.title,
                  kolname: profile.kolname,
                  cost: job.cost,
                  creditterm: job.creditterm,
                  discount: job.discount,
                  email: job.email,
                  jobid: job.jobid,
                  jobno: job.jobno,
                  lineid: job.lineid,
                  mobile: job.mobile,
                  price: job.price,
                  product: job.product,
                  ratecost: job.ratecost,
                  remark: job.remark,
                  salename: job.salename,
                  scope: job.scope,
                  workingtime: job.workingtime,
                  margin: job.margin
                }))
              }))
            }));
            // console.log(Object.values(kolview));

            this.KOLView = Object.values(kolview);

            // console.log(this.KOLView);
          }

          hideOverlay();
        });
    },
    resetFilter() {
      this.jobno = "";
      this.kolname = "";
      this.categorytag = "";
      this.platform = "";
      this.product = "";
      this.suppliername = "";
      this.bydate = "";

      this.filterdata();
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
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      // console.log(this.selectedRowKeys);
    },
    browsefile() {
      $("#browsethumb").trigger("click");
    },
    previewFiles(event) {
      $(".thumbnail-profile").removeClass("require");
      if (event.target.files[0] == undefined) {
        $("#profile").hide();
        $(".popup #profile").attr("src", "");
        return;
      } else {
        $("#profile").show();
      }

      var sizeInMB = (event.target.files[0].size / (1024 * 1024)).toFixed(2);
      if (sizeInMB > 4) {
        $("#browsethumb").val("");
        $("#profile").attr("src", "");
        alert("กรุณาเลือกรูปที่มีขนาดไฟล์ไม่เกิน 4 MB -- " + sizeInMB);
      } else {
        var file = event.target.files[0];
        if (file == undefined) {
          this.files = event.target.files[0];
        } else {
          var output = document.getElementById("profile");
          output.src = URL.createObjectURL(file);
        }
      }
    },
    checkUrl(url, index) {
      this.getUrlParts(url, index);
    },
    getUrlParts(url, index) {
      if (url == "") {
        this.urlList[index].platformtitle = "";
        this.urlList[index].platformid = "";
      } else if (url.indexOf("://") == -1) {
        this.urlList[index].platformtitle = "";
        this.urlList[index].platformid = "";
      } else {
        var host = new URL(url).hostname.split(".");
        var hostnamelength = host.length;
        var domain = host[hostnamelength - 2];

        var platformName = this.platformList.map(obj => {
          const _url = obj.title.toLowerCase();
          return _url;
        });

        var platformurl = platformName.find(x => x === domain);

        if (platformurl !== undefined) {
          var _platformid = this.checkIdPlatformId(domain);
          this.urlList[index].platformtitle = domain;
          this.urlList[index].platformid = _platformid;
          this.urlList[index].platformparam1 = this.checkPlatformParm(
            _platformid,
            "param1"
          );
          this.urlList[index].platformparam2 = this.checkPlatformParm(
            _platformid,
            "param2"
          );
        } else {
          var _platformid = this.checkIdPlatformId("website");
          this.urlList[index].platformtitle = "website";
          this.urlList[index].platformid = _platformid;
        }
      }
    },
    checkPlatformParm(platformid, id) {
      const _platform = this.platformList.find(x => x.id === platformid);

      if (id == "param1") return _platform.param1;
      if (id == "param2") return _platform.param2;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    handleChange(tag, checked) {
      // console.log(this.selectedTags);
      const { selectedTags } = this;
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter(t => t !== tag);
      this.selectedTags = nextSelectedTags;

      if (this.selectedTags.length !== 0) {
        $("#categoryListItem").removeClass("require");
      }
    },
    addNewKol() {
      showOverlay();
      var input = document.getElementById("browsethumb");
      var fileupload = input.files[0];

      if (this.addkolname.replace(/\s/g, "") == "")
        $("#addkolname").addClass("require");
      if (fileupload == undefined) $(".thumbnail-profile").addClass("require");
      if (this.selectedTags.length == 0)
        $("#categoryListItem").addClass("require");
      if (this.tags.length == 0)
        $(".vue-tags-input .ti-input").addClass("require");

      const _tags = this.tags;
      const tags = _tags.map(val => {
        return val.text;
      });

      var urlList = this.urlList;

      for (var i = urlList.length - 1; i >= 0; i--) {
        if (
          urlList[i].title == undefined ||
          urlList[i].title == "" ||
          urlList[i].url == undefined ||
          urlList[i].url == ""
        ) {
          urlList[i].status = false;
        } else if (urlList[i].platformid == "") {
          urlList[i].status = false;
        } else {
          urlList[i].status = true;
        }

        if (urlList[i].url == "" && urlList[i].title == "") {
          urlList.splice(i, 1);
        }
      }
      this.urlList = urlList;
      if (this.urlList.length == 0) {
        $(".popup .url-wrapper").addClass("require");
        this.addItem();

        this.urlList.forEach(function() {
          urlList[0].status = "false";
        });
      }

      if ($(".require").length !== 0 || fileupload == undefined) {
        hideOverlay();
        return;
      }

      const url = this.urlList.map(obj => {
        const _url = obj.url;
        return _url;
      });

      const platformid = this.urlList.map(obj => {
        const _platformid = obj.platformid;
        return _platformid;
      });
      const platformtitle = this.urlList.map(obj => {
        const _platformtitle = obj.title;
        return _platformtitle;
      });
      const platformparam1 = this.urlList.map(obj => {
        const _platformparam1 = obj.platformparam1;
        return _platformparam1;
      });
      const platformparam2 = this.urlList.map(obj => {
        const _platformparam2 = obj.platformparam2;
        return _platformparam2;
      });

      var formData = new FormData();
      formData.append("apitoken", this.apitoken);
      formData.append("kolname", this.addkolname);
      formData.append("platformid", platformid.join("|"));
      formData.append("platformurl", url.join("|"));
      formData.append("platformtitle", platformtitle.join("|"));
      formData.append("categoryid", this.selectedTags.join("|"));
      formData.append("tag", tags.join("|"));
      formData.append("fileUpload", fileupload);
      formData.append("platformparam1", platformparam1.join("|"));
      formData.append("platformparam2", platformparam2.join("|"));

      axios
        .post(`${this.$store.state.apiURL}KOL/KOLAdd.aspx`, formData)
        .then(({ data }) => {
          if (data.result == "complete") {
            this.closePopup();
            this.filterdata();
            hideOverlay();
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else if (data.detail == "KOL_existing") {
            alert("KOL existing");
            $("#addkolname").addClass("require");
            hideOverlay();
          } else {
            alert(data.detail);
            hideOverlay();
          }
        });
    },
    editeKol() {
      showOverlay();
      var input = document.getElementById("browsethumb");
      var fileupload = input.files[0];

      if (this.addkolname == "") $("#addkolname").addClass("require");
      if (fileupload == undefined && $(".popup #profile").attr("src") == "")
        $(".thumbnail-profile").addClass("require");
      if (this.selectedTags.length == 0)
        $("#categoryListItem").addClass("require");
      if (this.tags.length == 0)
        $(".vue-tags-input .ti-input").addClass("require");

      const _tags = this.tags;
      const tags = _tags.map(val => {
        return val.text;
      });

      var urlList = this.urlList;
      var error = 0;

      for (var i = urlList.length - 1; i >= 0; i--) {
        if (urlList[i].title == "" || urlList[i].url == "") {
          urlList[i].status = false;
          error = error + 1;
        } else if (urlList[i].platformid == "") {
          urlList[i].status = false;
          error = error + 1;
        } else {
          urlList[i].status = true;
        }

        if (urlList[i].url == "" && urlList[i].title == "") {
          urlList.splice(i, 1);
        }
      }
      this.urlList = urlList;

      const url = this.urlList.map(obj => {
        const _url = obj.url;
        return _url;
      });

      const platformid = this.urlList.map(obj => {
        const _platformid = obj.platformid;
        return _platformid;
      });
      const platformtitle = this.urlList.map(obj => {
        const _platformtitle = obj.title;
        return _platformtitle;
      });
      const platformparam1 = this.urlList.map(obj => {
        const _platformparam1 = obj.platformparam1;
        return _platformparam1;
      });
      const platformparam2 = this.urlList.map(obj => {
        const _platformparam2 = obj.platformparam2;
        return _platformparam2;
      });
      const kolplatformid = this.urlList.map(obj => {
        const _kolplatformid = obj.kolplatformid;
        return _kolplatformid;
      });

      if (this.urlList.length == 0) {
        error = error + 1;
        $(".popup .url-wrapper").addClass("require");
        this.addItem();

        this.urlList.forEach(function() {
          urlList[0].status = "false";
        });
      }

      if ($(".require").length !== 0 || error !== 0) {
        hideOverlay();
        return;
      }

      var formData = new FormData();
      formData.append("apitoken", this.apitoken);
      formData.append("profileid", this.profileid);
      formData.append("kolname", this.addkolname);
      formData.append("platformid", platformid.join("|"));
      formData.append("platformurl", url.join("|"));
      formData.append("platformtitle", platformtitle.join("|"));
      formData.append("categoryid", this.selectedTags.join("|"));
      formData.append("tag", tags.join("|"));
      formData.append("fileUpload", fileupload);
      formData.append("platformparam1", platformparam1.join("|"));
      formData.append("platformparam2", platformparam2.join("|"));
      formData.append("kolplatformid", kolplatformid.join("|"));

      axios
        .post(`${this.$store.state.apiURL}KOL/KOLEdit.aspx`, formData)
        .then(({ data }) => {
          if (data.result == "complete") {
            this.closePopup();
            this.filterdata();
            hideOverlay();
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else if (data.detail == "KOL_existing") {
            alert("KOL existing");
            $("#addkolname").addClass("require");
            hideOverlay();
          } else {
            alert(data.detail);
            hideOverlay();
          }
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
            // alert("complete");
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.closePopup();
          this.filterdata();
        });
    },

    jobAdd() {
      showOverlay();
      if (this.addjobno.replace(/\s/g, "") == "")
        $("#addjobno").addClass("require");
      if (this.addscope == "") $("#addscope").addClass("require");
      if (this.addproduct == "") $("#addproduct").addClass("require");
      if (this.addsuppliername.replace(/\s/g, "") == "")
        $("#addsuppliername").addClass("require");
      if (this.addtimeline.replace(/\s/g, "") == "")
        $("#addtimeline").addClass("require");
      if (this.addratecardcost.replace(/\s/g, "") == "")
        $("#addratecardcost").addClass("require");
      if (
        this.addratecardcost.replace(/\s/g, "") !== "" &&
        !checkInp(this.addratecardcost)
      )
        $("#addratecardcost").addClass("require");
      if (
        this.adddiscount.replace(/\s/g, "") !== "" &&
        !checkInp(this.adddiscount)
      )
        $("#adddiscount").addClass("require");
      if (this.addcost.replace(/\s/g, "") == "")
        $("#addcost").addClass("require");
      if (this.addcost.replace(/\s/g, "") !== "" && !checkInp(this.addcost))
        $("#addcost").addClass("require");
      if (this.addprice.replace(/\s/g, "") == "")
        $("#addprice").addClass("require");
      if (this.addprice.replace(/\s/g, "") !== "" && !checkInp(this.addprice))
        $("#addprice").addClass("require");

      if ($(".require").length !== 0) {
        hideOverlay();
        return;
      }

      var formData = new FormData();
      formData.append("apitoken", this.apitoken);
      formData.append("profileid", this.profileid);
      formData.append("platformid", this.platformid);
      formData.append("kolplatformid", this.kolplatformid);
      formData.append("scopeid", this.addscope);
      formData.append("contactid", this.addsuppliername);
      formData.append("jobno", this.addjobno);
      formData.append("product", this.addproduct);
      formData.append("ratecost", this.addratecardcost);
      formData.append("discount", this.adddiscount);
      formData.append("cost", this.addcost);
      formData.append("price", this.addprice);
      formData.append("margin", this.addmargin);
      formData.append("remark", this.addremark);
      formData.append("workingtime", this.addtimeline);

      axios
        .post(`${this.$store.state.apiURL}job/jobAdd.aspx`, formData)
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else if (data.result == "complete") {
            //
          } else {
            alert(data.detail);
          }
          this.closePopup();
          this.filterdata();
          hideOverlay();
        });
    },
    jobEdit() {
      showOverlay();
      if (this.addjobno.replace(/\s/g, "") == "")
        $("#addjobno").addClass("require");
      if (this.addscope == "") $("#addscope").addClass("require");
      if (this.addproduct == "") $("#addproduct").addClass("require");
      if (this.addsuppliername.replace(/\s/g, "") == "")
        $("#addsuppliername").addClass("require");
      if (this.addtimeline.replace(/\s/g, "") == "")
        $("#addtimeline").addClass("require");
      if (this.addratecardcost.replace(/\s/g, "") == "")
        $("#addratecardcost").addClass("require");
      if (
        this.addratecardcost.replace(/\s/g, "") !== "" &&
        !checkInp(this.addratecardcost)
      )
        $("#addratecardcost").addClass("require");
      if (
        this.adddiscount.replace(/\s/g, "") !== "" &&
        !checkInp(this.adddiscount)
      )
        $("#adddiscount").addClass("require");
      if (this.addcost.replace(/\s/g, "") == "")
        $("#addcost").addClass("require");
      if (this.addcost.replace(/\s/g, "") !== "" && !checkInp(this.addcost))
        $("#addcost").addClass("require");
      if (this.addprice.replace(/\s/g, "") == "")
        $("#addprice").addClass("require");
      if (this.addprice.replace(/\s/g, "") !== "" && !checkInp(this.addprice))
        $("#addprice").addClass("require");
      if ($(".require").length !== 0) {
        hideOverlay();
        return;
      }

      var formData = new FormData();
      formData.append("apitoken", this.apitoken);
      formData.append("jobid", this.jobid);
      formData.append("profileid", this.profileid);
      formData.append("platformid", this.platformid);
      formData.append("kolplatformid", this.kolplatformid);
      formData.append("scopeid", this.addscope);
      formData.append("contactid", this.addsuppliername);
      formData.append("jobno", this.addjobno);
      formData.append("product", this.addproduct);
      formData.append("ratecost", this.addratecardcost);
      formData.append("discount", this.adddiscount);
      formData.append("cost", this.addcost);
      formData.append("price", this.addprice);
      formData.append("margin", this.addmargin);
      formData.append("remark", this.addremark);
      formData.append("workingtime", this.addtimeline);

      axios
        .post(`${this.$store.state.apiURL}job/jobEdit.aspx`, formData)
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else if (data.result == "complete") {
            //
          } else {
            alert(data.detail);
          }
          this.closePopup();
          this.filterdata();
          hideOverlay();
        });
    },
    deleteJob(jobid, kolplatformid) {
      showOverlay();

      const filter = {
        params: {
          apitoken: this.apitoken,
          jobid: jobid,
          kolplatformid: kolplatformid
        }
      };

      axios
        .get(`${this.$store.state.apiURL}job/jobDelete.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            // alert("complete");
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.closePopup();
          this.filterdata();
          hideOverlay();
        });
    },
    getScopeId(id) {
      const platform = this.scopeList.find(x => x.id === item_id);
      return platform;
    },
    jobAddToMyList() {
      if (this.selectedRowKeys.length == 0) {
        alert("Select Job");
        return;
      }
      const jobSelect = this.selectedRowKeys.join("|");

      showOverlay();

      const filter = {
        params: {
          apitoken: this.apitoken,
          jobid: jobSelect
        }
      };

      axios
        .get(`${this.$store.state.apiURL}myKOL/jobAddToMyList.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            this.resetSelectRow();

            var addComplete = data.jobresults
              .filter(x => x.jobresult === "complete")
              .map(x => x);

            if (
              localStorage.mykolcount == undefined ||
              localStorage.mykolcount == "" ||
              localStorage.mykolcount == 0
            ) {
              localStorage.setItem("mykolcount", addComplete.length);
            } else {
              localStorage.setItem(
                "mykolcount",
                parseFloat(localStorage.mykolcount) +
                  parseFloat(addComplete.length)
              );
            }
            this.mykolcount = localStorage.mykolcount;
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          this.closePopup();
          this.filterdata();
          hideOverlay();
        });
    },
    contactViewByKOL(id, profileid) {
      showOverlay();
      const filter = {
        params: {
          apitoken: this.apitoken,
          profileid: profileid
        }
      };

      axios
        .get(`${this.$store.state.apiURL}contact/contactViewByKOL.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            $(".popup#" + id).addClass("open");
            var profile = data.profile;
            this.profileid = profile[0].profileid;
            this.kolname = profile[0].kolname;
            this.contactbykolList = data.profile[0];

            // var result = data.profile
            //   .map(value =>
            //     value.contact.map(child =>
            //       Object.assign(
            //         { profileid: value.profileid },
            //         { kolname: value.kolname },
            //         { kolpic: value.kolpic },
            //         {
            //           contactid: child.contactid,
            //           creditterm: child.creditterm,
            //           email: child.email,
            //           lineid: child.lineid,
            //           mobile: child.mobile,
            //           salename: child.salename,
            //           type: child.type
            //         }
            //       )
            //     )
            //   )
            //   .reduce((l, n) => l.concat(n), []);

            // if (result.length == 0) {
            //   var result_ = data.profile.map(contact => ({
            //     profileid: contact.contactid, // I added this line
            //     kolname: contact.kolname,
            //     kolpic: contact.kolpic,
            //     contactid: "",
            //     mobile: "",
            //     creditterm: "",
            //     email: "",
            //     lineid: "",
            //     mobile: "",
            //     salename: "",
            //     type: ""
            //   }));

            //   this.contactbykolList = result_;
            // } else {
            //   this.contactbykolList = result;
            // }

            hideOverlay();
          } else if (data.detail == "invalid_apitoken") invalid_apitoken();
          else alert(data.detail);
          hideOverlay();
        });
    },
    contactRemoveFromKOL(contactid) {
      const filter = {
        params: {
          apitoken: this.apitoken,
          profileid: this.profileid,
          contactid: contactid
        }
      };

      axios
        .get(
          `${this.$store.state.apiURL}contact/contactRemoveFromKOL.aspx`,
          filter
        )
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else if (data.result == "complete") {
            this.contactViewByKOL("contactbykolview", this.profileid);
          } else {
            alert(data.detail);
          }
        });
    },
    openKol(id) {
      $(".collapse-table > li#kol_" + id).toggleClass("open");
    },
    openKolPlatform(id) {
      $(".collapse-table > li#platform_" + id).toggleClass("open");
    },
    resetSelectRow() {
      setTimeout(() => {
        this.selectedRowKeys = [];
      }, 500);
    },
    addItem() {
      this.urlList.push({
        url: "",
        platformid: "",
        platformtitle: "",
        kolplatformid: "",
        title: "",
        status: true,
        platformparam1: "",
        platformparam2: ""
      });
    },
    checkIdPlatformId(platformtitle) {
      const _platform = this.platformList.find(
        x => x.title.toLowerCase() === platformtitle.toLowerCase()
      );
      return _platform.id;
    },
    checkIdPlatform(platformid) {
      const _platform = this.platformList.find(x => x.id === platformid);
      return _platform.title.toLowerCase();
    },
    checkProfilename(profileid) {
      const _profilename = this.KOLView.find(x => x.profileid === profileid);
      return _profilename.kolname;
    },
    SearchByFilter(ev) {
      clearTimeout(typingTimer);
      window.typingTimer = setTimeout(
        function() {
          this.filterdataByFilter();
        }.bind(this),
        doneTypingInterval
      );
    },
    ignoreChar(event) {
      ignoreChar(event);
    },
    handlerKeyup(event) {
      const _this = this;
      const id = event.target.id;
      $("#" + id).removeClass("require");
    },
    handlerUrlKeyup(event) {
      $(".url-wrapper").removeClass("require");
    }
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        $(".vue-tags-input .ti-input").removeClass("require");
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
    marginFilter() {
      var result = ((this.addprice - this.addcost) / this.addprice) * 100;
      if (
        this.addprice !== "" &&
        this.addcost !== "" &&
        isNaN(result.toFixed()) !== true &&
        result !== -Infinity
      ) {
        this.addmargin = result.toFixed();
      } else {
        this.addmargin = 0;
      }
    },
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  filters: {
    checkIdPlatform(platformid, platformList) {
      const _platform = platformList.find(x => x.id === platformid);
      return _platform.title.toLowerCase();
    },
    getClassMargin(margin) {
      if (margin < 30) {
        return "red";
      } else return "";
    },
    addComma(value) {
      return (parseInt(value) + "").replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    },
    getDateFormat(date) {
      return moment(date)
        .format("DD-MMM-YY")
        .toUpperCase();
    }
  },
  mounted() {
    this.filterSetting();
  }
};
</script>
