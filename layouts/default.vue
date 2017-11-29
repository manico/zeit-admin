<template>
  <v-app dark>
    <v-navigation-drawer app
                         fixed
                         :clipped="isDrawerClipped"
                         v-model="drawer">
      <v-list>
        <v-list-tile :exact="index === 0"
                     :to="item"
                     :key="item.name"
                     v-for="(item, index) in menu">
          <v-list-tile-action>
            <v-icon>widgets</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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
      <nuxt/>
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
      },
      menu () {
        return this.$router.options.routes
      }
    },
    methods: {
      toggleDrawer () {
        this.drawer = !this.drawer
      }
    }
  }
</script>