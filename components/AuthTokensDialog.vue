<template>
  <v-dialog v-model="dialog"
            lazy
            max-width="640">
    <v-btn icon
           slot="activator">
      <v-icon>person_add</v-icon>
    </v-btn>
    <v-card>
      <v-card-title class="headline">
        <span>Authorization Tokens</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-form v-model="valid"
              ref="form">
        <v-container fluid
                     grid-list-lg>
          <v-layout row
                    wrap>
            <v-flex xs12
                    sm4>
              <v-text-field box
                            required
                            name="name"
                            color="orange"
                            label="Name"
                            :maxlength="authTokenNameLength"
                            :rules="[rules.required]"
                            v-model="authToken.name">
              </v-text-field>
            </v-flex>
            <v-flex xs12
                    sm8>
              <v-text-field box
                            required
                            name="value"
                            color="orange"
                            label="Authorization token"
                            hint="Paste here your API authorization token"
                            persistent-hint
                            :maxlength="authTokenValueLength"
                            :counter="authTokenValueLength"
                            :rules="[rules.required, rules.authTokenValueLength]"
                            v-model="authToken.value">
              </v-text-field>
            </v-flex>
            <v-flex xs12
                    class="text-xs-right">
              <v-btn color="red"
                     class="mx-0"
                     :disabled="!valid"
                     @click="addAuthToken">
                Add
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-card-text v-if="authTokens.length">
        <v-list two-line>
          <v-subheader>Existing tokens</v-subheader>
          <v-divider></v-divider>
          <v-list-tile v-for="item in authTokens"
                       :key="item.name">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.value }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-avatar>
              <v-btn icon
                     @click="deleteAuthToken(item)">
                <v-icon color="red">close</v-icon>
              </v-btn>
            </v-list-tile-avatar>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat
               @click.native="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      const self = this

      return {
        dialog: false,
        authTokenNameLength: 12,
        authTokenValueLength: 24,
        authToken: {},
        valid: false,
        rules: {
          required (value) {
            return !!value || 'Required field'
          },
          authTokenValueLength (value) {
            return (!value || value.length === self.authTokenValueLength) || 'Invalid auth token length'
          }
        }
      }
    },
    props: {
      active: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      authTokens () {
        return this.$store.getters.authTokens
      }
    },
    watch: {
      dialog (value) {
        this.$emit('input', value)
      },
      active (value) {
        this.dialog = value
      }
    },
    methods: {
      close () {
        this.dialog = false
      },
      deleteAuthToken (token) {
        this.$store.dispatch('deleteAuthToken', token)
      },
      addAuthToken () {
        if (this.authToken) {
          this.$store.dispatch('addAuthToken', this.authToken)
        }
      }
    }
  }
</script>
