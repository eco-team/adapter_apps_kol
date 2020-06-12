<template>
  <div id="row">
    <div id="content" :class="{admin:depGroup!=='Media KOL', user:depGroup!=='Media KOL'}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    // Header: Header
  },
  data() {
    return {
      depGroup: this.$store.state.depGroup
    };
  }
};
</script>