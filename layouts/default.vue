<template>
  <v-app dark>
    <v-navigation-drawer app
                         fixed
                         :clipped="isDrawerClipped"
                         v-model="drawer">
    </v-navigation-drawer>
    <v-toolbar app
               dense
               fixed
               clipped-left
               color="red">
      <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Zeit Admin</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt/>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: null
      }
    },
    computed: {
      isDrawerClipped () {
        return this.$vuetify.breakpoint.width > 1264
      }
    },
    methods: {
      toggleDrawer () {
        this.drawer = !this.drawer
      }
    }
  }
</script>