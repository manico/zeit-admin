<template>
  <v-list>
    <v-list-tile active-class="red--text"
                 :exact="item.exact"
                 :to="{ name: item.to }"
                 :key="item.to"
                 v-for="item in items">
      <v-list-tile-action>
        <v-icon>{{item.icon}}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{item.title}}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      items () {
        return this.$store.getters.menus.main
      }
    }
  }
</script>
