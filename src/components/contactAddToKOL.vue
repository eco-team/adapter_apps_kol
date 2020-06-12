<template>
  <div class="popup addContact" :id="type">
    <div>
      <h5>{{kolname}} : Add contact</h5>
      <div class="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-radio-group name="radioGroup" v-model="contacttypeAddToKOL">
              <a-radio value="KOL Sale">Sale</a-radio>
              <a-radio value="Supplier">Supplier</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="contacttypeAddToKOL=='KOL Sale'">
          <a-col :span="24">
            <a-select v-model="saleAddToKOL">
              <a-select-option value>Select Sale</a-select-option>
              <a-select-option v-for="data in kolsaleList" :key="data.contactid">{{data.salename}}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="contacttypeAddToKOL=='Supplier'">
          <a-col :span="24">
            <a-select v-model="supplierAddToKOL">
              <a-select-option value>Select Supplier</a-select-option>
              <a-select-option
                v-for="data in contactnameList"
                :key="data.contactid"
              >{{data.salename}}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>
      <div class="text-right">
        <button class="btn red cancel" @click="closePopup()">Cancel</button>
        <button class="btn red" @click="contactAddToKOL()">Add</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    type: String,
    action: String,
    contacttype: String,
    saleadd: String,
    kolsaleList: Array,
    contactnameList: Array,
    profileid: String,
    kolname: String
  },
  data() {
    return {
      contacttypeAddToKOL: this.contacttype,
      saleAddToKOL: "",
      supplierAddToKOL: "",
      apitoken: this.$store.state.apitoken,
      contactid: ""
    };
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    contactAddToKOL(profileid, contactid) {
      var contactid;
      if (this.contacttypeAddToKOL == "KOL Sale") {
        contactid = this.saleAddToKOL;
        if (this.saleAddToKOL == "") {
          alert("Select sale");
          return;
        }
      } else {
        contactid = this.supplierAddToKOL;
        if (this.supplierAddToKOL == "") {
          alert("Select Supplier");
          return;
        }
      }

      const filter = {
        params: {
          apitoken: this.apitoken,
          profileid: this.profileid,
          contactid: contactid
        }
      };

      axios
        .get(`${this.$store.state.apiURL}contact/contactAddToKOL.aspx`, filter)
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
    filterdata() {
      this.$emit("filterdata");
    }
  },
  mounted() {}
};
</script>

