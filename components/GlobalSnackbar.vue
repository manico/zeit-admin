<template>
  <v-snackbar :timeout="4000"
              color="red"
              v-model="snackbar"
              @input="onTimeout">
    <span v-if="error">
      {{ error.message }}
    </span>
    <v-btn flat
           @click.native="close">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
  import _isNull from 'lodash/isNull'

  export default {
    data () {
      return {
        snackbar: false
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      }
    },
    watch: {
      error (value) {
        this.snackbar = !_isNull(value)
      }
    },
    methods: {
      close () {
        this.$store.dispatch('setError')
        this.snackbar = false
      },
      onTimeout () {
        this.$store.dispatch('setError')
      }
    }
  }
</script>
