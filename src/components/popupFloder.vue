<template>
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
            <a-input id="addfoldername" v-model="addfoldername" placeholder @keyup="handlerKeyup" />
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
</template>
<script>
import axios from "axios";
export default {
  props: {
    action: String,
    type: String,
    addfoldername: "",
    addfolderdescription: ""
  },
  data() {
    return {
      contacttypeAddToKOL: this.contacttype,
      apitoken: this.$store.state.apitoken,
      contactid: ""
    };
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    handlerKeyup() {
      this.$emit("handlerKeyup");
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
    filterdata() {
      this.$emit("filterdata");
    }
  },
  mounted() {}
};
</script>

