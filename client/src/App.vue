<template>
  <v-app dark>
    <TopNav />
    <v-content>
      <router-view />
    </v-content>
    <BottomNav /> 
  </v-app>
</template>
<script>
  import ItemService from '@/services/ItemService'
  import TopNav from '@/components/TopNav.vue'
  import BottomNav from '@/components/BottomNav.vue'

  export default {
    name: 'App',
    components: {
      TopNav,
      BottomNav
    },
    data() {
      return {
      }
    },
  }
</script>

<style>
  .theme--dark.v-toolbar {
    background-color: #80DEEA;
    color: #303030;
  }

  .headline {
    color: white;
    text-decoration: none;
  }

  .search input {
    color: #303030 !important;
  }

  .search label {
    color: #303030 !important;
  }

  .color-dark {
    color: #303030 !important;
  }

  .pointer {
    cursor: pointer;
  }

  .links {
    color: white;
    text-decoration: none;
  }
</style>