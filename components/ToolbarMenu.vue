<template>
  <div>
    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>
    <v-menu bottom
            left>
      <v-btn icon
             slot="activator">
        <v-icon>account_circle</v-icon>
      </v-btn>
      <v-list two-line>
        <v-list-tile v-for="item in authTokens"
                     :key="item.name"
                     @click="setAuthToken(item)">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.value }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-avatar v-if="item.active">
            <v-icon color="green">check_circle</v-icon>
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      authTokens () {
        return this.$store.getters.authTokens
      }
    },
    methods: {
      setAuthToken (token) {
        this.$store.dispatch('setAuthToken', token)
      }
    }
  }
</script>
