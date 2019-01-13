<template>
  <v-app dark>
    <TopNav />
    <v-content>
      <router-view />
      <v-snackbar v-model="errorMessage.error" :timeout="3000" :color="errorMessage.color" v-if="errorMessage">
        {{ errorMessage.message }}
        <v-btn flat @click="errorMessage.error = false">Close</v-btn>
      </v-snackbar>
    </v-content>
    <BottomNav />
  </v-app>
</template>
<script>
  import TopNav from '@/components/TopNav.vue'
  import BottomNav from '@/components/BottomNav.vue'
  import {
    mapGetters
  } from 'vuex'

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
    computed: {
      ...mapGetters({
        errorMessage: 'errorMessage'
      })
    }
  }
</script>

<style>
  .pointer {
    cursor: pointer;
  }

  a {
    color: #fff !important;
    text-decoration: none;
  }

  .link{
    text-decoration: underline
  }
</style>