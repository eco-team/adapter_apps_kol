<template>
  <header>
    <h1 v-if="apitoken == undefined"></h1>
    <ul id="nav" v-if="apitoken !==undefined && apitoken !== null && apitoken !== undefined">
      <li>
        <router-link to="/RateCard" tag="a">Rate Card</router-link>
      </li>
      <li>
        <router-link to="/KOLlist" tag="a">KOL list</router-link>
      </li>
      <li>
        <router-link to="/Contact" tag="a">Contact</router-link>
      </li>
      <li>
        <router-link to="/Setting" tag="a">Setting</router-link>
      </li>
    </ul>

    <a
      class="logout"
      onclick="invalid_apitoken()"
      v-if="apitoken !==undefined && apitoken !== null && apitoken !== undefined"
    >Logout</a>
  </header>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      apitoken: this.$store.state.apitoken
    };
  },
  mounted() {}
};
</script>