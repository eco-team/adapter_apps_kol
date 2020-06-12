<template>
  <div id="contact" class="wrapper">
    <div id="filter" class="box">
      <h4>Contact person</h4>

      <button class="btn red addnew" @click="openPopup('contact','add')" v-if="tabOpen=='sale'">
        <span>+</span> Add new sale
      </button>
      <button class="btn red addnew" @click="openPopup('contact','add')" v-if="tabOpen=='supplier'">
        <span>+</span> Add new supplier
      </button>
      <p class="desc">This is a description for contact person</p>

      <a-row :gutter="24" v-if="tabOpen=='kol'">
        <a-col :span="10">
          <a-auto-complete
            :dataSource="KOLnameList"
            placeholder="Name"
            :filterOption="filterOption"
            @select="onSelectKol"
            @change="onFilter('kol')"
            v-model="kolname"
          />
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="tabOpen=='sale'">
        <a-col :span="10">
          <a-auto-complete
            :dataSource="SaleNameList"
            placeholder="Name"
            :filterOption="filterOption"
            @select="onSelectSale"
            @change="onFilter('sale')"
            v-model="contactname"
          />
        </a-col>
      </a-row>

      <a-row :gutter="24" v-if="tabOpen=='supplier'">
        <a-col :span="10">
          <a-auto-complete
            :dataSource="SupplierNameList"
            placeholder="Name"
            :filterOption="filterOption"
            @select="onSelectSupplier"
            @change="onFilter('supplier')"
            v-model="contactname"
          />
        </a-col>
      </a-row>

      <ul id="tabs" class="tab-contact">
        <li>
          <a class="kol" @click="openTab('kol')">KOL contact</a>
        </li>
        <li>
          <a class="sale" @click="openTab('sale')">Sale</a>
        </li>
        <li>
          <a class="supplier" @click="openTab('supplier')">Supplier</a>
        </li>
      </ul>
    </div>

    <div
      v-if="contactViewByKOL.length == 0 || kolsaleList.length == 0 || contactnameList.length == 0"
      class="notdata"
    >Not Found</div>

    <div id="contentFilter">
      <div id="kol">
        <ul id="datainfolder" class="collapse-table">
          <li v-for="(kol,index) in contactViewByKOL" :key="index" :id="'kol_'+index">
            <div class="head">
              <div class="header-desc">
                <span class="kolpic">
                  <img src="../assets/images/default.png" v-if="kol.kolpic == ''" />
                  <img :src="kol.kolpic" />
                </span>
                <span class="kolname">{{kol.kolname}}</span>
              </div>
              <div class="action addcontact">
                <a @click="openPopup('addContact','add', kol.profileid,kol.kolname)">Add contact</a>
              </div>
            </div>
            <div class="detail">
              <a-table
                :columns="columsale"
                :dataSource="kol.contactsales"
                :pagination="false"
                rowKey="contactid"
              >
                <div slot="action" slot-scope="contactid">
                  <a-popconfirm
                    title="Are you sure delete?"
                    @confirm="contactRemoveFromKOL(kol.profileid,contactid)"
                    cancelText="No"
                    okText="Yes"
                  >
                    <a>Delete</a>
                  </a-popconfirm>
                </div>
              </a-table>
              <a-table
                :columns="columsupplier"
                :dataSource="kol.contactsupplier"
                :pagination="false"
                rowKey="contactid"
              >
                <div slot="action" slot-scope="contactid">
                  <a-popconfirm
                    title="Are you sure delete?"
                    @confirm="contactRemoveFromKOL(kol.profileid,contactid)"
                    cancelText="No"
                    okText="Yes"
                  >
                    <a>Delete</a>
                  </a-popconfirm>
                </div>
              </a-table>
            </div>
          </li>
        </ul>
      </div>
      <div id="sale">
        <a-table :columns="columsale" :dataSource="kolsaleList" :pagination="true">
          <div slot="action" slot-scope="contactid">
            <a @click="editContact(contactid,'sale')">Edit</a>
            <a-popconfirm
              title="Are you sure delete?"
              @confirm="deleteContact(contactid)"
              cancelText="No"
              okText="Yes"
            >
              <a>Delete</a>
            </a-popconfirm>
          </div>
        </a-table>
      </div>
      <div id="supplier">
        <a-table :columns="columsupplier" :dataSource="contactnameList" :pagination="true">
          <div slot="action" slot-scope="contactid">
            <a @click="editContact(contactid,'supplier')">Edit</a>
            <a-popconfirm
              title="Are you sure delete?"
              @confirm="deleteContact(contactid)"
              cancelText="No"
              okText="Yes"
            >
              <a>Delete</a>
            </a-popconfirm>
          </div>
        </a-table>
      </div>
    </div>

    <div class="popup contact" :id="type">
      <div :class="action">
        <h5 v-if="action=='add'">
          <span v-if="tabOpen=='sale'">Add new sale</span>
          <span v-if="tabOpen=='supplier'">Add new supplier</span>
        </h5>
        <h5 v-if="action=='edit'">
          <span v-if="type=='sale'">Edit sale</span>
          <span v-if="tabOpen=='supplier'">Edit supplier</span>
        </h5>
        <div class="form">
          <!-- <a-row :gutter="24" v-if="action=='add'">
            <a-col :span="24">
              <a-radio-group
                name="radioGroup"
                :defaultValue="contacttype"
                v-model="contacttype"
                @change="resetdata"
              >
                <a-radio value="KOL Sale">Sale</a-radio>
                <a-radio value="Supplier">Supplier</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>-->
          <div>
            <a-row :gutter="24">
              <a-col :span="12">
                <label>Name</label>
                <a-input v-model="addname" id="addrname" @keyup="handlerKeyup" maxlength="50" />
              </a-col>
              <a-col :span="12">
                <label>Line ID</label>
                <a-input v-model="addlineid" id="addlineid" @keyup="handlerKeyup" maxlength="50" />
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <label>Phone</label>
                <a-input v-model="addmobile" id="addmobile" maxlength="10" @keyup="handlerKeyup" />
              </a-col>
              <a-col :span="12">
                <label>Email</label>
                <a-input v-model="addemail" id="addemail" maxlength="50" @keyup="handlerKeyup" />
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="contacttype=='KOL Sale'">
              <a-col :span="24">
                <label>Credit term</label>
                <a-input
                  v-model="addcreditterm"
                  id="addcreditterm"
                  maxlength="50"
                  @keyup="handlerKeyup"
                />
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="text-right">
          <button class="btn red cancel" @click="closePopup()">Cancel</button>
          <button class="btn red" v-if="action=='add'" @click="addContact">Create</button>
          <button class="btn red" v-if="action=='edit'" @click="saveEditContact">Save</button>
        </div>
      </div>
    </div>

    <contactAddToKOL
      v-if="profileid !== ''"
      :id="type"
      :contacttype="contacttype"
      :kolsaleList="kolsaleList"
      :contactnameList="contactnameList"
      :profileid="profileid"
      :kolname="kolname"
      v-on:closePopup="closePopup"
      v-on:filterdata="filterdata"
      class="open"
    ></contactAddToKOL>
  </div>
</template>

<script>
import axios from "axios";
import contactAddToKOL from "../components/contactAddToKOL.vue";
export default {
  components: {
    contactAddToKOL
  },
  data() {
    return {
      apitoken: this.$store.state.apitoken,
      contactid: "",
      contacttype: "KOL Sale",
      type: "",
      action: "",
      contactname: "",
      kolname: "",
      columsale,
      columsupplier,
      addcreditterm: "",
      addname: "",
      addlineid: "",
      addmobile: "",
      addemail: "",
      contactnameList: [],
      kolsaleList: [],
      dataSource: [],
      contactViewByKOL: [],
      saleadd: "",
      supplieradd: "",
      KOLnameList: [],
      tabOpen: "",
      profileid: ""
    };
  },
  methods: {
    openTab(id) {
      this.filterdata();
      this.contactname = "";
      this.kolname = "";
      this.tabOpen = id;
      if (id == "sale") {
        this.contacttype = "KOL Sale";
      } else if (id == "supplier") {
        this.contacttype = "Supplier";
      }
      $("#tabs li a").removeClass("opentab");
      $("#tabs ." + id).addClass("opentab");
      $("#contentFilter > #" + id)
        .addClass("open")
        .siblings()
        .removeClass("open");
    },
    openPopup(id, action, name, desc) {
      $(".popup." + id).addClass("open");
      this.type = id;
      this.action = action;

      if (id == "contact") {
        if (action == "add") {
          this.titletype = "Add new " + id;
        } else if (action == "edit") {
          this.titletype = "Edit " + id;
          this.addfoldername = name;
          this.addfolderdescription = desc;
        }
      } else if (id == "addContact") {
        this.profileid = name;
        this.kolname = desc;
      }
    },
    closePopup() {
      $(".popup").removeClass("open");
      this.addname = "";
      this.addlineid = "";
      this.addlineid = "";
      this.addmobile = "";
      this.addemail = "";
      this.contactid = "";
      this.addcreditterm = "";
      this.profileid = "";
      this.kolname = "";
      this.saleadd = "";
      this.supplieradd = "";
      this.contacttype = "KOL Sale";

      $(".popup")
        .find(".require")
        .removeClass("require");
    },
    resetdata() {
      $(".popup")
        .find(".require")
        .removeClass("require");
    },
    editContact(id, type) {
      this.getDataById(id, type);
      this.openPopup("contact", "edit");
    },
    addContact() {
      if (this.addname.replace(/\s/g, "") == "")
        $("#addrname").addClass("require");
      if (this.addlineid.replace(/\s/g, "") == "")
        $("#addlineid").addClass("require");
      if (this.addmobile.replace(/\s/g, "") == "")
        $("#addmobile").addClass("require");
      if (
        this.addmobile.replace(/\s/g, "") !== "" &&
        !checkMobilePhone(this.addmobile)
      ) {
        $("#addmobile").addClass("require");
      }
      if (this.addemail.replace(/\s/g, "") == "")
        $("#addemail").addClass("require");
      if (
        this.addemail.replace(/\s/g, "") !== "" &&
        !validateEmail(this.addemail)
      ) {
        $("#addemail").addClass("require");
      }
      if (this.contacttype == "KOL Sale" && this.addcreditterm == "") {
        $("#addcreditterm").addClass("require");
      }

      if ($(".require").length !== 0) {
        hideOverlay();
        return;
      }
      var formData = new FormData();
      formData.append("apitoken", this.apitoken);
      formData.append("contacttype", this.contacttype);
      formData.append("name", this.addname.replace(/\s/g, ""));
      formData.append("lineid", this.addlineid.replace(/\s/g, ""));
      formData.append("mobile", this.addmobile);
      formData.append("email", this.addemail);
      formData.append("creditterm", this.addcreditterm);

      axios
        .post(`${this.$store.state.apiURL}contact/contactAdd.aspx`, formData)
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else if (data.result == "complete") {
            // alert("success");
            this.filterdata();
            this.closePopup();
          } else {
            alert(data.detail);
          }
        });
    },
    saveEditContact() {
      showOverlay();

      if (this.addname.replace(/\s/g, "") == "")
        $("#addrname").addClass("require");
      if (this.addlineid.replace(/\s/g, "") == "")
        $("#addlineid").addClass("require");
      if (this.addmobile.replace(/\s/g, "") == "")
        $("#addmobile").addClass("require");
      if (
        this.addmobile.replace(/\s/g, "") !== "" &&
        !checkMobilePhone(this.addmobile)
      ) {
        $("#addmobile").addClass("require");
      }
      if (this.addemail.replace(/\s/g, "") == "")
        $("#addemail").addClass("require");
      if (
        this.addemail.replace(/\s/g, "") !== "" &&
        !validateEmail(this.addemail)
      ) {
        $("#addemail")
          .replace(/\s/g, "")
          .addClass("require");
      }
      if (this.contacttype == "KOL Sale" && this.addcreditterm == "") {
        $("#addcreditterm").addClass("require");
      }

      if ($(".require").length !== 0) {
        hideOverlay();
        return;
      }

      var formData = new FormData();
      formData.append("apitoken", this.apitoken);
      formData.append("contacttype", this.contacttype);
      formData.append("contactid", this.contactid);
      formData.append("name", this.addname.replace(/\s/g, ""));
      formData.append("lineid", this.addlineid.replace(/\s/g, ""));
      formData.append("mobile", this.addmobile);
      formData.append("email", this.addemail);
      formData.append("creditterm", this.addcreditterm);

      axios
        .post(`${this.$store.state.apiURL}contact/contactEdit.aspx`, formData)
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else if (data.result == "complete") {
            // alert("Edit success");
            this.filterdata();
            this.closePopup();
          } else {
            alert(data.detail);
          }
          hideOverlay();
        });
    },
    deleteContact(id) {
      showOverlay();
      const filter = {
        params: {
          apitoken: this.apitoken,
          contactid: id
        }
      };

      axios
        .get(`${this.$store.state.apiURL}contact/contactDelete.aspx`, filter)
        .then(({ data }) => {
          if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else if (data.result == "complete") {
            this.filterdata();
          } else if (data.detail == "contact_inused") {
            alert("contact inused");
          } else {
            alert(data.detail);
          }
          hideOverlay();
        });
    },
    filterdata() {
      showOverlay();
      const filtersale = {
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

      const filterViewByKOL = {
        params: {
          apitoken: this.apitoken
        }
      };

      Promise.all([
        axios
          .get(
            `${this.$store.state.apiURL}contact/contactView.aspx`,
            filtersale
          )
          .then(({ data }) => {
            if (data.result == "complete") {
              // console.log(data.contact);
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

              const _nameList = data.contact.map(obj => {
                return obj.salename;
              });
              this.SaleNameList = _nameList;

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

              const _nameList = data.contact.map(obj => {
                return obj.salename;
              });
              this.SupplierNameList = _nameList;
              this.contactnameList = _contactnameList;
              // console.log(this.contactnameList);

              hideOverlay();
            } else if (data.detail == "invalid_apitoken")
              this.invalid_apitoken();
            else {
              alert(data.detail);
            }
          }),
        axios
          .get(
            `${this.$store.state.apiURL}contact/contactViewByKOL.aspx`,
            filterViewByKOL
          )
          .then(({ data }) => {
            if (data.result == "complete") {
              // const contactViewByKOL = data.profile.map(profile => ({
              //   key: profile.profileid, // I added this line
              //   profileid: profile.profileid,
              //   kolname: profile.kolname,
              //   kolpic: profile.kolpic,
              //   contact: profile.contact.map(contact => ({
              //     contactid: contact.contactid,
              //     profileid: profile.profileid,
              //     salename: contact.salename,
              //     creditterm: contact.creditterm,
              //     email: contact.email,
              //     lineid: contact.lineid,
              //     mobile: contact.mobile
              //   }))
              // }));
              this.contactViewByKOL = data.profile;
              const _contactViewByKOLname = data.profile.map(obj => {
                return obj.kolname;
              });
              this.KOLnameList = _contactViewByKOLname;

              // console.log(this.contactViewByKOL);
            } else if (data.detail == "invalid_apitoken")
              this.invalid_apitoken();
            else {
              alert(data.detail);
            }
          })
      ]);
    },
    filterbySearchKol() {
      const filterViewByKOL = {
        params: {
          apitoken: this.apitoken,
          salename: this.contactname,
          kolname: this.kolname
        }
      };

      axios
        .get(
          `${this.$store.state.apiURL}contact/contactViewByKOL.aspx`,
          filterViewByKOL
        )
        .then(({ data }) => {
          if (data.result == "complete") {
            // const contactViewByKOL = data.profile.map(profile => ({
            //   key: profile.profileid, // I added this line
            //   profileid: profile.profileid,
            //   kolname: profile.kolname,
            //   kolpic: profile.kolpic,
            //   contact: profile.contact.map(contact => ({
            //     contactid: contact.contactid,
            //     profileid: profile.profileid,
            //     salename: contact.salename,
            //     creditterm: contact.creditterm,
            //     email: contact.email,
            //     lineid: contact.lineid,
            //     mobile: contact.mobile
            //   }))
            // }));
            this.contactViewByKOL = data.profile;
          } else if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else {
            alert(data.detail);
          }
        });
    },
    filterbySearchSale() {
      const filter = {
        params: {
          apitoken: this.apitoken,
          salename: this.contactname,
          contacttype: "KOL Sale"
        }
      };

      axios
        .get(`${this.$store.state.apiURL}contact/contactView.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            // console.log(data.contact);
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
          } else if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else {
            alert(data.detail);
          }
        });
    },
    filterbySearchSupplier() {
      const filter = {
        params: {
          apitoken: this.apitoken,
          salename: this.contactname,
          contacttype: "Supplier"
        }
      };

      axios
        .get(`${this.$store.state.apiURL}contact/contactView.aspx`, filter)
        .then(({ data }) => {
          if (data.result == "complete") {
            // console.log(data.contact);
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

            this.contactnameList = _contactnameList;
            // console.log(this.contactnameList);

            hideOverlay();
          } else if (data.detail == "invalid_apitoken") this.invalid_apitoken();
          else {
            alert(data.detail);
          }
        });
    },
    getDataById(id, type) {
      var tableDataSelect;
      if (type == "sale") {
        tableDataSelect = this.kolsaleList.find(x => x.contactid === id);
      } else if (type == "supplier") {
        tableDataSelect = this.contactnameList.find(x => x.contactid === id);
      }

      this.contacttype = tableDataSelect.type;
      this.addname = tableDataSelect.salename;
      this.addlineid = tableDataSelect.lineid;
      this.addmobile = tableDataSelect.mobile;
      this.addemail = tableDataSelect.email;
      this.addcreditterm = tableDataSelect.creditterm;
      this.contactid = id;
    },
    contactRemoveFromKOL(profileid, contactid) {
      const filter = {
        params: {
          apitoken: this.apitoken,
          profileid: profileid,
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
            this.filterdata();
            this.closePopup();
          } else {
            alert(data.detail);
          }
        });
    },
    onSelectKol(value) {
      this.filterbySearchKol();
    },
    SearchKol(ev) {
      this.filterbySearchKol();
    },
    onSelectSale(value) {
      this.filterbySearchSale();
    },
    SearchSale(ev) {
      this.filterbySearchSale();
    },
    onSelectSupplier(value) {
      this.filterbySearchSupplier();
    },
    SearchSupplier(ev) {
      this.filterbySearchSupplier();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    onFilter(id) {
      clearTimeout(typingTimer);
      window.typingTimer = setTimeout(
        function() {
          if (id == "kol") {
            this.filterbySearchKol();
          } else if (id == "sale") {
            this.filterbySearchSale();
          } else if (id == "supplier") {
            this.filterbySearchSupplier();
          }
        }.bind(this),
        doneTypingInterval
      );
    },
    handlerKeyup(event) {
      const _this = this;
      const id = event.target.id;
      $("#" + id).removeClass("require");
    }
  },
  mounted() {
    this.filterdata();
    this.openTab("kol");
  },
  filters: {
    checkLenght(contact) {
      return contact.length;
    }
  }
};
</script>