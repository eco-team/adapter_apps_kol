<template>
  <div id="kollist" class="wrapper">
    <div id="filter" class="box">
      <h4>KOL list</h4>
      <p class="desc">This is a description for KOL list</p>
      <div>
        <b-row>
          <b-col cols="12" md="3">
            <b-form-input id="jobno" v-model="kolname" placeholder="KOL name"></b-form-input>
          </b-col>
          <b-col cols="12" md="3">
            <b-form-input id="kolname" v-model="foldername" placeholder="Folder name"></b-form-input>
          </b-col>
          <b-col cols="12" md="2">
            <b-form-select id="plattfrom" v-model="plattfrom" :options="options"></b-form-select>
          </b-col>
        </b-row>
      </div>
    </div>

    <div id="dataFilter">
      <ul id="tabs">
        <li class="open">
          <a>KOL list</a>
        </li>
        <li>
          <a>My folder</a>
        </li>
      </ul>

      <div>
        <b-tabs content-class="mt-3">
          <b-tab title="First" active>
            <p>I'm the first tab</p>
          </b-tab>
          <b-tab title="Second">
            <p>I'm the second tab</p>
          </b-tab>
        </b-tabs>
      </div>

      <div>
        <b-table
          ref="selectableTable"
          selectable
          :select-mode="selectMode"
          selected-variant="active"
          :items="items"
          :fields="fields"
          responsive="sm"
        >
          <!-- Example scoped slot for select state illustrative purposes -->
          <b-form-checkbox id="checkbox">dd</b-form-checkbox>
        </b-table>
      </div>
    </div>
    {{selected}}
    <div id="footer-page" class="text-right">
      <button class="btn red delete">
        <i class="fa fa-trash-o"></i> Delete
      </button>
      <button class="btn red addtofolder">
        <i class="fa fa-plus-circle"></i> Add to folder
      </button>
      <button class="btn white exportxlsx">
        <i class="fa fa-file-excel-o"></i> Export to xlsx.
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      apitoken: this.$store.state.apitoken,
      kolname: "",
      foldername: "",
      plattfrom: "all",
      options: [
        { value: "all", text: "All plattfrom" },
        { value: "a", text: "1" },
        { value: "b", text: "2" },
        { value: "c", text: "3" },
        { value: "d", text: "4" }
      ],
      items: [
        {
          isActive: true,
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
          isActive: false,
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
        "isActive",
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
      rowSelected: [],
      selected: "",
      selectMode: "multi"
    };
  },
  methods: {
    select(e) {
      this.selected = [];
      if (!this.selectAll) {
        console.log(e);
        for (let i in this.items) {
          this.selected.push(this.items[i].id);
        }
      } else {
      }
    },
    onRowSelected(items) {
      this.selected = items;
    }
  },
  mounted() {
    //
  }
};
</script>