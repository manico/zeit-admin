<template>
  <div class="toolbar-menu">
    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>
    <v-menu bottom
            left>
      <v-btn icon
             slot="activator">
        <v-icon>account_circle</v-icon>
      </v-btn>
      <v-card class="toolbar-menu-tokens">
        <v-card-title class="headline">
          <span class="mr-4">Autorization Tokens</span>
          <v-spacer></v-spacer>
          <auth-tokens-dialog :active="authTokensDialog"
                              @input="setAuthTokensDialog">
          </auth-tokens-dialog>
        </v-card-title>
        <v-divider></v-divider>
        <v-list two-line
                v-if="authTokens.length">
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
        <div class="text-xs-center pa-4"
             v-if="!authTokens.length">
          <v-btn outline
                 large
                 fab
                 color="grey darken-2"
                 @click="setAuthTokensDialog(true)">
            <v-icon>person_add</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  import AuthTokensDialog from '~/components/AuthTokensDialog'
  import AuthorizationAlert from '~/components/AuthorizationAlert'

  export default {
    components: {
      AuthTokensDialog,
      AuthorizationAlert
    },
    data () {
      return {
        authTokensDialog: false
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
      },
      setAuthTokensDialog (value) {
        this.authTokensDialog = value
      }
    }
  }
</script>
