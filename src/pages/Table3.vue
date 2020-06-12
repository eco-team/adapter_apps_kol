<template>
  <div>
    <ul class="group-code">
      <li v-for="item in limit" :key="item">
        <app-url
          :id="item-1"
          type="text"
          @handleKeyup="handlerUrl"
          :errorMessage="errorMessage[item-1]"
          v-model="groupUrl[item-1]"
        ></app-url>
      </li>
    </ul>

    <a @click="addUrl">addUrl</a>
    <br />
    <a @click="submit">submit</a>
  </div>
</template>
<script>
import Url from "../components/Url.vue";
export default {
  components: {
    appUrl: Url
  },
  data() {
    return {
      limit: 1,
      groupUrl: [],
      errorMessage: []
    };
  },
  methods: {
    handlerUrl(event) {
      const _this = this;
      const id = event.target.id;

      const errorMessage = [...this.errorMessage];
      errorMessage[id] = "";

      const groupUrl = [...this.groupUrl];

      const chknull = groupUrl.some(item => {
        return item !== "";
      });

      if (chknull) {
        this.codeNull = false;
        this.someError = false;
      } else {
        this.codeNull = true;
      }

      this.errorMessage = errorMessage;
    },
    addUrl() {
      this.limit = this.limit + 1;
      console.log(this.limit);
    },
    submit() {
      console.log(this.groupUrl);
    }
  }
};
</script>
