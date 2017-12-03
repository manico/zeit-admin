<template>
  <v-app dark>
    <v-navigation-drawer app
                         fixed
                         :clipped="isDrawerClipped"
                         v-model="drawer">
      <main-menu></main-menu>
    </v-navigation-drawer>
    <v-toolbar app
               dense
               fixed
               clipped-left
               color="red">
      <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Zeit Admin</v-toolbar-title>
      <v-spacer></v-spacer>
      <toolbar-menu></toolbar-menu>
    </v-toolbar>
    <v-content>
      <authorization-alert class="ma-4"></authorization-alert>
      <nuxt/>
      <global-snackbar></global-snackbar>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
  import api from '~/api'
  import MainMenu from '~/components/MainMenu'
  import ToolbarMenu from '~/components/ToolbarMenu'
  import GlobalSnackbar from '~/components/GlobalSnackbar'
  import AuthorizationAlert from '~/components/AuthorizationAlert'

  export default {
    components: {
      MainMenu,
      ToolbarMenu,
      GlobalSnackbar,
      AuthorizationAlert
    },
    data () {
      return {
        drawer: null,
        errorSnackbar: false
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
    },
    beforeCreate () {
      api.http.interceptors.request.use(api.interceptor(this.$store))
    }
  }
</script>