


    <template>
  <div class="popup folder" :id="type">
    <div :class="action">
      <h5 v-if="action=='add'">Create new folder</h5>
      <h5 v-if="action=='edit'">Edit folder</h5>
      <div class="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <label>Folder name</label>
            <a-input v-model="addfoldername" id="addfoldername" @input="updateName" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <label>Description</label>
            <a-input v-model="addfolderdescription" id="addfolderdescription" />
          </a-col>
        </a-row>
      </div>
      <div class="text-right">
        <button class="btn red cancel" @click="closePopup()">Cancle</button>
        <button class="btn red" v-if="action=='add'" @click="createFolder">Create</button>
        <button class="btn red" v-if="action=='edit'" @click="editFolder">Save</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    addfoldername: String,
    addfolderdescription: String,
    type: "",
    action: ""
  },
  data() {
    return {};
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    createFolder() {
      this.$emit("createFolder");
    },
    editFolder() {
      this.$emit("editFolder");
    },
    updateName() {
      this.$emit. = this.addfoldername;
    }
  },
  mounted() {}
};
</script>

