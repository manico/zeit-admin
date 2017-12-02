<template>
  <v-dialog v-model="dialog"
            lazy
            max-width="640">
    <v-card v-if="deployment">
      <v-progress-linear :indeterminate="true"
                         height="2"
                         class="ma-0"
                         color="red"
                         v-if="loading">
      </v-progress-linear>
      <v-card-title>
        <div>
          <div class="headline">Deployment Aliases</div>
          <div class="grey--text">{{deployment.url}}</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-form v-model="valid"
              ref="form">
        <v-container fluid
                     grid-list-lg>
          <v-layout row
                    wrap>
            <v-flex xs12>
              <v-text-field box
                            required
                            autocomplete="off"
                            name="alias"
                            color="orange"
                            label="Alias"
                            hint="Enter full domain name. Example: manic.now.sh"
                            persistent-hint
                            :rules="[rules.required]"
                            v-model="alias">
              </v-text-field>
            </v-flex>
            <v-flex xs12
                    class="text-xs-right">
              <v-btn color="red"
                     class="mx-0"
                     :disabled="!valid"
                     @click="addAlias">
                Add
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-card-text v-if="deployment.aliases && deployment.aliases.length">
        <v-list two-line>
          <v-subheader>Existing aliases</v-subheader>
          <v-divider></v-divider>
          <v-list-tile v-for="item in deployment.aliases"
                       :key="item.uid">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.alias }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ formatDateTime(item.created) }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-avatar>
              <v-btn icon
                     @click="deleteAlias(item)">
                <v-icon color="red">close</v-icon>
              </v-btn>
            </v-list-tile-avatar>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat
               @click.native="close">Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import _isNil from 'lodash/isNil'
  import formattable from '~/mixins/formattable'

  export default {
    mixins: [
      formattable
    ],
    data () {
      return {
        alias: null,
        dialog: false,
        loading: false,
        rules: {
          required (value) {
            return !!value || 'Required field'
          }
        },
        valid: false
      }
    },
    props: {
      deployment: {
        type: Object
      }
    },
    watch: {
      dialog (value) {
        if (!value) {
          this.$emit('cancel')
        }
      },
      deployment (current, previous) {
        if (current !== previous) {
          this.dialog = !_isNil(current)
          if (this.dialog) {
            this.loading = true
            this.$store.dispatch('loadDeploymentAliases', current).then(() => {
              this.loading = false
            })
          }
        }
      }
    },
    methods: {
      addAlias () {
        if (this.alias) {
          this.loading = true
          this.$store.dispatch('addDeploymentAlias', {
            deployment: this.deployment,
            alias: {
              alias: this.alias
            }
          }).then((result) => {
            if (_isNil(result.error)) {
              this.alias = null
            }

            this.loading = false
          })
        }
      },
      close () {
        this.dialog = false
      },
      deleteAlias (alias) {
        this.loading = true
        this.$store.dispatch('deleteDeploymentAlias', {
          deployment: this.deployment,
          alias
        }).then(() => {
          this.loading = false
        })
      }
    }
  }
</script>
