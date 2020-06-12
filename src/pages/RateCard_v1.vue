<template>
  <div id="RateCard" class="wrapper">
    <div id="filter" class="box">
      <h4>KOL Rate Card</h4>
      <p class="desc">This is a description for KOL rate card</p>
      <button class="btn red addnew" onClick="openPopup('addnewkol')">
        <span>+</span> Add a new KOL
      </button>
      <div>
        <b-row>
          <b-col cols="5" md="2">
            <b-form-input id="jobno" v-model="jobno" placeholder="JobNo."></b-form-input>
          </b-col>
          <b-col cols="7" md="3">
            <b-form-input id="kolname" v-model="kolname" placeholder="KOL name"></b-form-input>
          </b-col>
          <b-col cols="12" md="7">
            <b-form-input id="category" v-model="category" placeholder="Category or tag"></b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6" md="2">
            <b-form-select id="plattfrom" v-model="plattfrom" :options="options"></b-form-select>
          </b-col>
          <b-col cols="6" md="3">
            <b-form-input id="product" v-model="product" placeholder="Product"></b-form-input>
          </b-col>
          <b-col cols="12" md="3">
            <b-form-input id v-model="suppliername" placeholder="Supplier name"></b-form-input>
          </b-col>
          <b-col cols="6" md="2">
            <b-form-select id="datefilter" v-model="datefilter" :options="optionsdate"></b-form-select>
          </b-col>
          <b-col cols="6" md="2" class="text-center">
            <button class="btn white reset" @click="resetFilter">Reset filters</button>
          </b-col>
        </b-row>
      </div>
    </div>
    <!-- <b-table striped hover :items="items"></b-table> -->

    <!-- <table class="table" id="table-kolratecard">
      <thead>
        <tr>
          <th width="20"></th>
          <th width="40"></th>
          <th width="150">KOL name</th>
          <th>Contact</th>
          <th width="140">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in kolData" :key="index">
          <td>
            <i class="fa fa-caret-right"></i>
          </td>
          <td>
            <div class="profile-img">
              <img :src="data.profile" />
            </div>
          </td>
          <td>{{data.kolname}}</td>
          <td>view</td>
          <td>
            <a>Edit</a>
            <a>Delete</a>
          </td>
        </tr>
      </tbody>
    </table>-->

    <div id="footer-page" class="text-right">
      <button class="btn red addnew">
        <span>+</span> Add to list
      </button>
      <button class="btn white reset" @click="resetFilter">view KOL list</button>
    </div>

    <div id="addnewkol" class="popup">
      <div>
        <h5>Add a new KOL</h5>
        <div class="form">
          <b-row>
            <div class="thumbnail-profile" @click="browsefile">
              <div>
                <img id="profile" src="../assets/images/blank.png" />
                <i class="fa fa-user-circle-o"></i>
                <input id="browsethumb" type="file" @change="previewFiles" />
              </div>
              <i class="fa fa-camera"></i>
            </div>

            <div class="col-9">
              <label>KOL name</label>
              <b-form-input id v-model="addkolname" placeholder></b-form-input>
            </div>
          </b-row>
          <b-row>
            <div class="thumbnail-url">
              <div></div>
            </div>
            <div class="col-10">
              <label>URL Link</label>
              <b-form-input id v-model="addurllink" placeholder class="url" @change="checkUrl()"></b-form-input>
              <div class="thumbnail-social" :id="urldomain"></div>
              <i class="fa fa-trash-o" @click="deleteUrl"></i>
            </div>
          </b-row>
          <b-row class="category">
            <div>
              <label>Category</label>
              <div>
                <span
                  class
                  v-for="(data,index) in addcategorylist"
                  :key="index"
                  @click="selectCategory"
                >{{data}}</span>
              </div>
            </div>
          </b-row>
          <b-row class="tags">
            <div class="col-12">
              <label>Tags</label>
              <div class="col-11">
                <!-- <b-form-textarea id="textarea" v-model="addtags" placeholder></b-form-textarea> -->
                <vue-tags-input
                  v-model="tag"
                  :tags="tags"
                  :autocomplete-items="filteredItems"
                  :placeholder="tagsplaceholder"
                  :addOnKey="[9, 13, 32, 188]"
                  @tags-changed="newTags => tags = newTags"
                />
              </div>
            </div>
          </b-row>
        </div>
        <div class="text-right">
          <button class="btn red cancel" onClick="closePopup()">Cancle</button>
          <button class="btn red">Add</button>
        </div>
      </div>
    </div>

    <div id="addnewratecard" class="popup">
      <div>
        <h5>Add new facebook Rate card : นี่หรือคนเมา</h5>
        <div class="form">
          <b-row>
            <b-col cols="6" md="6">
              <label>Job No.</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
            <b-col cols="6" md="6">
              <label>Scope of work</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6" md="6">
              <label>Product</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
            <b-col cols="6" md="6">
              <label>Supplier name</label>
              <b-form-select v-model="suppliername" :options="options"></b-form-select>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6" md="6">
              <label>Timeline</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
          </b-row>

          <div class="line"></div>

          <b-row>
            <b-col cols="6" md="6">
              <label>Rate card cost (THB):</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
            <b-col cols="6" md="6">
              <label>Discount:</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6" md="6">
              <label>Cost (THB):</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
            <b-col cols="6" md="6">
              <label>Price (THB):</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6" md="6">
              <label>Margin (%):</label>
              <b-form-input id v-model="addurllink" placeholder></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="12">
              <label>Remark</label>
              <b-form-textarea id v-model="addurllink" placeholder></b-form-textarea>
            </b-col>
          </b-row>
        </div>
        <div class="text-right">
          <button class="btn red cancel" onClick="closePopup()">Cancle</button>
          <button class="btn red">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";
export default {
  components: {
    VueTagsInput
  },
  data() {
    return {
      jobno: "",
      kolname: "",
      category: "",
      plattfrom: "all",
      options: [
        { value: "all", text: "All plattfrom" },
        { value: "a", text: "1" },
        { value: "b", text: "2" },
        { value: "c", text: "3" },
        { value: "d", text: "4" }
      ],
      product: "",
      suppliername: "",
      datefilter: "null",
      optionsdate: [{ value: "null", text: "Date" }],
      items: [
        { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
        { age: 21, first_name: "Larsen", last_name: "Shaw" },
        { age: 89, first_name: "Geneva", last_name: "Wilson" },
        { age: 38, first_name: "Jami", last_name: "Carney" }
      ],

      addkolname: "",
      addurllink: "",
      addcategory: [],
      addcategorylist: [
        "Beauty",
        "Fashion",
        "Financial",
        "Food & Dining",
        "Gaming",
        "Health & Fitness",
        "Family & Kids",
        "Lifestyle & Entertainment",
        "Online Program",
        "Pets",
        "Promotion",
        "Social News",
        "Travel",
        "Movie",
        "Music",
        "LCORHOR Drink",
        "Real estate",
        "Water & Mineral water",
        "Soft drink"
      ],
      addtags: "",

      tag: "",
      tags: [],
      tagsplaceholder: "",
      autocompleteItems: [
        {
          text: "รีวิวสายฮา"
        },
        {
          text: "กินเก่ง"
        },
        {
          text: "เที่ยวเก่ง"
        },
        {
          text: "รีวิวสวยๆ"
        }
      ],
      files: "",
      urldomain: "",

      //table
      fields: [
        {
          key: "",
          label: ""
        },
        {
          key: "KOL name",
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
      kolData: [
        {
          profile:
            "https://scontent.fbkk8-4.fna.fbcdn.net/v/t1.0-9/62071969_2033386050303835_1713195427114778624_n.png?_nc_cat=1&_nc_oc=AQnbUPMsbipiSBK0txtpk5TgBT0Re2SxheW5hcm0NNlTa0EQYa-drtauGdDnysuskl4&_nc_ht=scontent.fbkk8-4.fna&oh=cb3352435ac1728ba1f36c29ca335860&oe=5DF190EC",
          kolname: "นี่หรือคนเมา",
          engagement: "55%",
          platform: "Facebook",
          Nofans: "55000",
          jobno: "00-0003",
          product: "Krungsri",
          scope: "Create photo album post",
          cost: "5,500",
          price: "6,000",
          margin: "53 %",
          remark: "ถ่ายภาพทำ production ใหม่ (ไม่เกิน10ภาพ)",
          timeline: "3-5 days"
        },
        {
          profile:
            "https://scontent.fbkk8-4.fna.fbcdn.net/v/t1.0-9/28377713_1374287842683526_1581335925137238808_n.jpg?_nc_cat=1&_nc_oc=AQk490FBkBXxZBpLY7tsgHsqBA0ajmlVff7CG8QZdJjQN546mfMvPf1J0FbdJdUw1lY&_nc_ht=scontent.fbkk8-4.fna&oh=0afec9167e9a2d114e5250253d64a75f&oe=5E282AB0",
          kolname: "พี่เอ็ด7วิ",
          engagement: "55%",
          platform: "Facebook",
          Nofans: "55000",
          jobno: "00-0003",
          product: "Krungsri",
          scope: "Create photo album post",
          cost: "5,500",
          price: "6,000",
          margin: "53 %",
          remark: "ถ่ายภาพทำ production ใหม่ (ไม่เกิน10ภาพ)",
          timeline: "3-5 days"
        },
        {
          profile:
            "https://scontent.fbkk8-4.fna.fbcdn.net/v/t1.0-9/62071969_2033386050303835_1713195427114778624_n.png?_nc_cat=1&_nc_oc=AQnbUPMsbipiSBK0txtpk5TgBT0Re2SxheW5hcm0NNlTa0EQYa-drtauGdDnysuskl4&_nc_ht=scontent.fbkk8-4.fna&oh=cb3352435ac1728ba1f36c29ca335860&oe=5DF190EC",
          kolname: "EFM",
          engagement: "55%",
          platform: "Facebook",
          Nofans: "55000",
          jobno: "00-0003",
          product: "Krungsri",
          scope: "Create photo album post",
          cost: "5,500",
          price: "6,000",
          margin: "53 %",
          remark: "ถ่ายภาพทำ production ใหม่ (ไม่เกิน10ภาพ)",
          timeline: "3-5 days"
        }
      ]
    };
  },
  methods: {
    resetFilter() {
      this.jobno = "";
      this.kolname = "";
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
    browsefile() {
      $("#browsethumb").trigger("click");
    },
    checkUrl() {
      this.getUrlParts(this.addurllink);
    },
    getUrlParts() {
      // https://www.facebook.com/RattanarangsiJunjira
      // https://twitter.com/junjira_rtnrs
      // https://m.facebook.com/Nenebbq
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
    }
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    }
  },
  mounted() {}
};
</script>