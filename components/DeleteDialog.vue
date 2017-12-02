<template>
  <v-dialog v-model="dialog"
            persistent
            lazy
            max-width="320">
    <slot name="activator"
          slot="activator">
    </slot>
    <v-card>
      <v-card-title class="headline">
        Confirm delete
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        Are you sure you wish to delete {{entity}}? This action is not reversable.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat
               @click.native="close">No</v-btn>
        <v-btn flat
               @click.native="confirm">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import _isNil from 'lodash/isNil'

  export default {
    data () {
      return {
        dialog: false
      }
    },
    props: {
      deletable: {
        type: Object
      },
      entity: {
        type: String,
        required: true
      }
    },
    watch: {
      deletable (value) {
        this.dialog = !_isNil(value)
      }
    },
    methods: {
      close () {
        this.$emit('cancel')
        this.dialog = false
      },
      confirm () {
        this.$emit('confirm')
        this.dialog = false
      }
    }
  }
</script>
