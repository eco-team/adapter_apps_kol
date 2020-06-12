<template>
  <div class="popup export">
    <div>
      <h5>Export to excel file</h5>
      <div class="form-export">
        <a-checkbox-group @change="onCheckExport" v-model="checkedList">
          <a-row :gutter="24">
            <a-col :span="8" v-for="data in exportList" :key="data">
              <a-checkbox :value="data">{{data}}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
      <div class="text-right">
        <button class="btn red cancel" @click="closePopup()">Cancle</button>
        <button class="btn red" @click="exportSubmit">
          <i class="fa fa-file-excel-o"></i> Export
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    exportList: Array,
    checkedList: Array
  },
  data() {
    return {};
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    onCheckExport(checkedValues) {
      this.$emit("onCheckExport", checkedValues);
    },
    exportSubmit() {
      this.$emit("exportSubmit");
    }
  },
  mounted() {}
};
</script>

