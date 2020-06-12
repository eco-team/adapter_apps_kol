<template>
  <div id="container">
    <Header></Header>
    <router-view></router-view>
    <div class="lightbox-overlay">
      <div class="loading-dot"></div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
export default {
  components: {
    Header: Header
  }
};
</script>