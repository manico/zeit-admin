<template>
  <v-alert color="error"
           icon="warning"
           value="true"
           v-if="!isAuthorized">
    <span>Please add authorization token to access your data.</span>
  </v-alert>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      isAuthorized () {
        return this.$store.getters.authorization
      }
    }
  }
</script>
