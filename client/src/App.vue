<template>
  <v-app dark>
    <TopNav />
    <v-content>
      <router-view />
      <v-snackbar v-model="errorMessage.show" :timeout="3000" :color="errorMessage.type" v-if="errorMessage" bottom>
        {{ errorMessage.message }}
        <v-btn flat @click="errorMessage.show = false">Close</v-btn>
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
      return {}
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
  }

  .link {
    text-decoration: underline
  }

  @media only screen and (max-width: 1264px) {
    table.v-table tbody td:not(:nth-child(1)){
      padding: 0 12px;
    }
  }
</style>